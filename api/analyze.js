const Anthropic = require('@anthropic-ai/sdk');
const XLSX = require('xlsx');
const mammoth = require('mammoth');
const { Resend } = require('resend');


const SUPPLIERS_CONTEXT = `
База поставщиков сэндвич-панелей ЦФО (цена за м², обычно БЕЗ НДС):
МОСКВА: DoorHan от 1890₽ (все типы), МосПанели от 1599₽ (ППС/ПИР), СП-Центр от 1680₽, ТеплоПремиум от 1850₽, МеталлПром от 1700₽, СП-Панель от 1720₽, ИЗОБУД от 1130₽ (ISO 9001), ГК ТехноСтиль от 1650₽ (все типы), Baustof от 1800₽, Stamet b2b от 1230₽, ТермоСпецПанель от 1750₽, Термопанель от 1800₽, СТРОЙПАНЕЛЬ от 2100₽, Энергосервис от 1650₽
МО: КлимПанель (Чехов) от 969₽ (МИН ЦЕНА рынка!), ТеплоПрофиль от 2097₽, ВЕКТРА от 1800₽, Гермес-Панель от 2000₽, ТД Стройкапитал от 1720₽, ГК СтилПан от 1750₽, Стройкомплект от 1900₽, ТЭП-Полис от 1750₽, МетПроф от 1700₽, Капитал Строй от 1850₽, МетПромЭнерго от 1720₽
ВОРОНЕЖ: СтальПрофильГрупп от 1360₽, DoorHan (Воронеж) от 1890₽
ЛИПЕЦК: ЛЗСП от 1690₽ (все типы, 2 завода), Вектор Сталь 48 от 1690₽
ТУЛА: Металл Профиль от 1950₽ (производитель №1 РФ), ТехноСтиль от 1650₽
РЯЗАНЬ: РязаньПанель от 1600₽
КУРСК: МстройПанель от 1360₽ (изготовление за 1 день), Тепло-Кус от 1226₽
ВЛАДИМИР: Stamet от 1230₽
`;

const SYSTEM_PROMPT = `Ты эксперт-аналитик рынка сэндвич-панелей ЦФО России.

${SUPPLIERS_CONTEXT}

ВАЖНО ПРО НДС: Рыночные цены обычно указываются БЕЗ НДС (цены B2B). При покупке как физлицо у поставщика на ОСНО к цене добавляется НДС 20%, который физлицо не возмещает. Поставщики на УСН — самый выгодный вариант для физлица.

Задача: проанализировать загруженный документ (спецификацию/КП/счёт), сравнить цены с рынком, дать конкретные рекомендации.

ВСЕГДА отвечай валидным JSON, без markdown-блоков, без текста вне JSON.`;

const USER_PROMPT_SUFFIX = `
Проанализируй документ и верни JSON строго в формате:
{
  "client": {"name": "...", "phone": "...", "email": "..."},
  "docTitle": "название документа или КП",
  "supplier": "название поставщика из документа (если есть)",
  "positions": [
    {
      "name": "описание позиции",
      "type": "тип (ППС/ПИР/ППУ/МВ/неизвестно)",
      "panelCategory": "стеновые или кровельные",
      "thickness": "толщина в мм",
      "width": "ширина в мм",
      "length": "длина в мм",
      "quantity": число,
      "m2": число,
      "pricePerM2": цена за м² числом или null,
      "total": сумма числом или null,
      "hasVat": true/false или null
    }
  ],
  "totals": {
    "m2Wall": число,
    "m2Roof": число,
    "m2Total": число,
    "priceTotal": число или null,
    "vatAmount": число или null,
    "priceTotalWithVat": число или null
  },
  "marketComparison": [
    {
      "supplier": "название поставщика",
      "region": "регион",
      "pricePerM2": цена числом,
      "totalForOrder": расчётная сумма числом,
      "saving": экономия числом,
      "savingPct": процент числом,
      "note": "короткое пояснение"
    }
  ],
  "vatNote": "объяснение про НДС для этого клиента (2-3 предложения)",
  "conclusion": "итоговый вывод (2-3 предложения)",
  "recommendation": "конкретный совет что делать (2-3 предложения)",
  "alternativeSuppliers": ["топ-3 альтернативных поставщика с ценами"]
}`;

async function extractText(fileBase64, fileName) {
  const ext = (fileName || '').split('.').pop().toLowerCase();
  const buffer = Buffer.from(fileBase64, 'base64');

  if (['xlsx', 'xls'].includes(ext)) {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    return rows
      .filter(r => r.some(c => String(c).trim() !== ''))
      .map(r => r.map(c => String(c).trim()).join('\t'))
      .join('\n');
  }

  if (ext === 'csv') {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    return rows.map(r => r.join('\t')).join('\n');
  }

  if (ext === 'txt') {
    return buffer.toString('utf-8');
  }

  if (['docx', 'doc'].includes(ext)) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (ext === 'pdf') {
    return null; // PDF sent as document block to Claude
  }

  throw new Error(`Формат .${ext} не поддерживается`);
}

const ALLOWED_EXTS = ['xlsx','xls','csv','txt','pdf','docx','doc'];
const extOf = name => (name || '').split('.').pop().toLowerCase();

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, phone, email, files } = req.body || {};
  if (!name || !phone || !email) return res.status(400).json({ error: 'Заполните все поля формы' });
  if (!files || !files.length) return res.status(400).json({ error: 'Загрузите хотя бы один файл' });

  // Валидация расширений на сервере
  for (const f of files) {
    const ext = extOf(f.fileName);
    if (!ALLOWED_EXTS.includes(ext)) {
      return res.status(400).json({ error: `Недопустимый формат файла: ${f.fileName}` });
    }
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const fileNames = files.map(f => f.fileName).join(', ');
    const clientInfo = `Клиент: ${name}, тел: ${phone}, email: ${email}\nФайлы: ${fileNames}`;

    // Собираем контент: PDF → document-блоки, остальные → текст (параллельно)
    const MAX_TEXT_PER_FILE = 12000; // символов — не даём огромным xlsx/docx замедлять Claude

    const pdfFiles = files.filter(f => extOf(f.fileName) === 'pdf');
    const textFiles = files.filter(f => extOf(f.fileName) !== 'pdf');

    // Параллельно извлекаем текст из всех не-PDF файлов
    const extractedTexts = await Promise.all(
      textFiles.map(async ({ fileBase64, fileName }) => {
        const text = await extractText(fileBase64, fileName);
        const trimmed = text.length > MAX_TEXT_PER_FILE
          ? text.slice(0, MAX_TEXT_PER_FILE) + `\n...[обрезано, показаны первые ${MAX_TEXT_PER_FILE} символов]`
          : text;
        return `\n--- ${fileName} ---\n${trimmed}`;
      })
    );

    const messageParts = [];
    const textParts = [clientInfo, ...extractedTexts];

    // PDF идут как document-блоки (нативная поддержка Claude)
    for (const { fileBase64 } of pdfFiles) {
      messageParts.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: fileBase64 },
      });
    }

    textParts.push(USER_PROMPT_SUFFIX);
    messageParts.push({ type: 'text', text: textParts.join('\n') });

    const messageContent = messageParts.length > 1 ? messageParts : messageParts[0].text;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: messageContent }],
    });

    const raw = message.content[0].text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Сервис не вернул корректный JSON');

    const analysis = JSON.parse(jsonMatch[0]);

    // Отправка email (только если RESEND_API_KEY задан)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fmt = n => n ? Math.round(n).toLocaleString('ru-RU') + ' ₽' : '—';
        const fmtM2 = n => n ? n.toFixed(1) + ' м²' : '—';
        const a = analysis;
        const posRows = (a.positions || []).map(p =>
          `<tr><td style="padding:6px 10px;border-bottom:1px solid #2a2f3a">${p.name}</td>
           <td style="padding:6px 10px;border-bottom:1px solid #2a2f3a;text-align:center">${p.type||'—'}</td>
           <td style="padding:6px 10px;border-bottom:1px solid #2a2f3a;text-align:center">${p.thickness||'—'}</td>
           <td style="padding:6px 10px;border-bottom:1px solid #2a2f3a;text-align:right">${fmtM2(p.m2)}</td>
           <td style="padding:6px 10px;border-bottom:1px solid #2a2f3a;text-align:right">${p.pricePerM2?Math.round(p.pricePerM2).toLocaleString('ru-RU')+' ₽':'—'}</td>
           <td style="padding:6px 10px;border-bottom:1px solid #2a2f3a;text-align:right">${fmt(p.total)}</td></tr>`
        ).join('');
        const cmpRows = (a.marketComparison || []).map(c =>
          `<tr><td style="padding:6px 10px;border-bottom:1px solid #2a2f3a"><b>${c.supplier}</b></td>
           <td style="padding:6px 10px;border-bottom:1px solid #2a2f3a;color:#8b92a5">${c.region||''}</td>
           <td style="padding:6px 10px;border-bottom:1px solid #2a2f3a;text-align:right">${Math.round(c.pricePerM2).toLocaleString('ru-RU')} ₽</td>
           <td style="padding:6px 10px;border-bottom:1px solid #2a2f3a;text-align:right;color:${c.saving>0?'#10b981':'#f43f5e'}">${c.saving>0?'−':'+'}${fmt(Math.abs(c.saving))}</td></tr>`
        ).join('');

        await resend.emails.send({
          from: `Анализ КП <hi@ad-unicorn.ru>`,
          to: [email],
          subject: `Анализ КП готов: ${a.docTitle || fileNames}`,
          html: `<!DOCTYPE html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 16px">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

  <!-- HEADER -->
  <tr><td style="background:#1e3a5f;border-radius:10px 10px 0 0;padding:24px 28px">
    <div style="font-size:10px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">Аналитика рынка сэндвич-панелей ЦФО</div>
    <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:4px">Ваш анализ КП готов</div>
    <div style="font-size:12px;color:rgba(255,255,255,.75)">${a.docTitle||fileNames} · ${new Date().toLocaleDateString('ru-RU')}</div>
  </td></tr>

  <!-- CLIENT -->
  <tr><td style="background:#fff;padding:20px 28px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
    <div style="font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Клиент</div>
    <div style="font-size:15px;font-weight:700;color:#111827">${a.client?.name||name}</div>
    <div style="font-size:12px;color:#6b7280;margin-top:3px">${a.client?.phone||phone} · ${a.client?.email||email}</div>
    ${a.supplier?`<div style="font-size:12px;color:#d97706;margin-top:6px;font-weight:600">Поставщик из КП: ${a.supplier}</div>`:''}
  </td></tr>

  <!-- METRICS -->
  <tr><td style="background:#fff;padding:0 28px 20px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="33%" style="padding-right:6px">
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px;text-align:center">
          <div style="font-size:18px;font-weight:700;color:#2563eb">${fmtM2(a.totals?.m2Total)}</div>
          <div style="font-size:10px;color:#6b7280;margin-top:4px">Всего м²</div>
        </div>
      </td>
      <td width="33%" style="padding:0 3px">
        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px;text-align:center">
          <div style="font-size:18px;font-weight:700;color:#ea580c">${fmt(a.totals?.priceTotal)}</div>
          <div style="font-size:10px;color:#6b7280;margin-top:4px">Сумма без НДС</div>
        </div>
      </td>
      <td width="34%" style="padding-left:6px">
        <div style="background:#fff5f5;border:1px solid #fca5a5;border-radius:8px;padding:12px;text-align:center">
          <div style="font-size:18px;font-weight:700;color:#dc2626">${fmt(a.totals?.vatAmount)}</div>
          <div style="font-size:10px;color:#6b7280;margin-top:4px">НДС 20%</div>
        </div>
      </td>
    </tr></table>
  </td></tr>

  ${posRows ? `<!-- POSITIONS -->
  <tr><td style="background:#fff;padding:0 28px 20px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
    <div style="font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #e5e7eb">Позиции заказа</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:11px">
      <tr style="background:#f9fafb">
        <th style="padding:6px 8px;font-size:9px;font-weight:600;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb">Позиция</th>
        <th style="padding:6px 8px;font-size:9px;font-weight:600;color:#6b7280;text-align:center;border-bottom:1px solid #e5e7eb">Тип</th>
        <th style="padding:6px 8px;font-size:9px;font-weight:600;color:#6b7280;text-align:center;border-bottom:1px solid #e5e7eb">Толщ.</th>
        <th style="padding:6px 8px;font-size:9px;font-weight:600;color:#6b7280;text-align:right;border-bottom:1px solid #e5e7eb">м²</th>
        <th style="padding:6px 8px;font-size:9px;font-weight:600;color:#6b7280;text-align:right;border-bottom:1px solid #e5e7eb">₽/м²</th>
        <th style="padding:6px 8px;font-size:9px;font-weight:600;color:#6b7280;text-align:right;border-bottom:1px solid #e5e7eb">Сумма</th>
      </tr>
      ${posRows}
    </table>
  </td></tr>` : ''}

  ${cmpRows ? `<!-- MARKET -->
  <tr><td style="background:#fff;padding:0 28px 20px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
    <div style="font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #e5e7eb">Сравнение с рынком ЦФО</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:11px">
      <tr style="background:#f9fafb">
        <th style="padding:6px 8px;font-size:9px;font-weight:600;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb">Поставщик</th>
        <th style="padding:6px 8px;font-size:9px;font-weight:600;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb">Регион</th>
        <th style="padding:6px 8px;font-size:9px;font-weight:600;color:#6b7280;text-align:right;border-bottom:1px solid #e5e7eb">₽/м²</th>
        <th style="padding:6px 8px;font-size:9px;font-weight:600;color:#6b7280;text-align:right;border-bottom:1px solid #e5e7eb">Экономия</th>
      </tr>
      ${cmpRows}
    </table>
  </td></tr>` : ''}

  <!-- CONCLUSION -->
  <tr><td style="background:#fff;padding:0 28px 20px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
    ${a.conclusion?`<div style="background:#eff6ff;border-left:3px solid #2563eb;padding:12px 14px;margin-bottom:12px;border-radius:0 6px 6px 0;font-size:12px;line-height:1.65;color:#1e3a5f">${a.conclusion}</div>`:''}
    ${a.recommendation?`<div style="background:#f0fdf4;border-left:3px solid #16a34a;padding:12px 14px;border-radius:0 6px 6px 0;font-size:12px;line-height:1.65;color:#14532d">${a.recommendation}</div>`:''}
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0 0 10px 10px;padding:14px 28px;text-align:center">
    <div style="font-size:11px;color:#9ca3af">sandwich-cfo.vercel.app · Аналитика рынка сэндвич-панелей ЦФО</div>
  </td></tr>

</table>
</td></tr></table>
</body></html>`,
        });
      } catch (emailErr) {
        console.warn('Email send failed (non-fatal):', emailErr.message);
      }
    }

    return res.status(200).json({ success: true, analysis });

  } catch (err) {
    console.error('analyze error:', err);
    return res.status(500).json({ error: err.message || 'Ошибка анализа' });
  }
};

module.exports.config = { maxDuration: 60 };
