const Anthropic = require('@anthropic-ai/sdk');
const XLSX = require('xlsx');
const mammoth = require('mammoth');
const { Resend } = require('resend');

module.exports.config = {
  api: { bodyParser: { sizeLimit: '12mb' } },
};

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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, phone, email, fileBase64, fileName } = req.body || {};
  if (!name || !phone || !email) return res.status(400).json({ error: 'Заполните все поля формы' });
  if (!fileBase64) return res.status(400).json({ error: 'Загрузите файл' });

  const ext = (fileName || '').split('.').pop().toLowerCase();

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const clientInfo = `Клиент: ${name}, тел: ${phone}, email: ${email}\nФайл: ${fileName || 'документ'}`;

    let messageContent;

    if (ext === 'pdf') {
      messageContent = [
        {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: fileBase64 },
        },
        { type: 'text', text: clientInfo + '\n' + USER_PROMPT_SUFFIX },
      ];
    } else {
      const text = await extractText(fileBase64, fileName);
      messageContent = clientInfo + '\n\nДанные из файла:\n' + text + '\n' + USER_PROMPT_SUFFIX;
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: messageContent }],
    });

    const raw = message.content[0].text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI не вернул корректный JSON');

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
          subject: `📊 Анализ вашего КП: ${a.docTitle || fileName}`,
          html: `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#0d0f12;font-family:Arial,sans-serif;color:#e8eaf0">
<div style="max-width:640px;margin:0 auto;padding:24px">
  <div style="background:linear-gradient(135deg,#3b82f6,#10b981);border-radius:10px;padding:20px 24px;margin-bottom:20px">
    <h1 style="margin:0;font-size:18px;color:#fff">📊 Ваш анализ КП готов</h1>
    <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.8)">${a.docTitle||fileName} · ${new Date().toLocaleDateString('ru-RU')}</p>
  </div>

  <div style="background:#13161b;border:1px solid #1f2330;border-radius:10px;padding:16px 20px;margin-bottom:16px">
    <div style="font-size:10px;color:#555d6e;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">Клиент</div>
    <div style="font-size:15px;font-weight:600">${a.client?.name||name}</div>
    <div style="font-size:13px;color:#8b92a5;margin-top:4px">${a.client?.phone||phone} · ${a.client?.email||email}</div>
    ${a.supplier?`<div style="font-size:12px;color:#f59e0b;margin-top:6px">Поставщик из КП: ${a.supplier}</div>`:''}
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">
    <div style="background:#13161b;border:1px solid #1f2330;border-radius:8px;padding:12px;text-align:center">
      <div style="font-size:18px;font-weight:700;color:#3b82f6">${fmtM2(a.totals?.m2Total)}</div>
      <div style="font-size:10px;color:#555d6e;margin-top:3px">Всего м²</div>
    </div>
    <div style="background:#13161b;border:1px solid #1f2330;border-radius:8px;padding:12px;text-align:center">
      <div style="font-size:18px;font-weight:700;color:#f59e0b">${fmt(a.totals?.priceTotal)}</div>
      <div style="font-size:10px;color:#555d6e;margin-top:3px">Сумма без НДС</div>
    </div>
    <div style="background:#13161b;border:1px solid #1f2330;border-radius:8px;padding:12px;text-align:center">
      <div style="font-size:18px;font-weight:700;color:#f43f5e">${fmt(a.totals?.vatAmount)}</div>
      <div style="font-size:10px;color:#555d6e;margin-top:3px">НДС 20%</div>
    </div>
  </div>

  ${posRows ? `<div style="background:#13161b;border:1px solid #1f2330;border-radius:10px;padding:16px 20px;margin-bottom:16px">
    <div style="font-size:10px;color:#555d6e;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">Позиции</div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead><tr style="color:#555d6e;font-size:10px">
        <th style="padding:4px 10px;text-align:left">Позиция</th><th style="padding:4px 10px">Тип</th>
        <th style="padding:4px 10px">Толщина</th><th style="padding:4px 10px;text-align:right">м²</th>
        <th style="padding:4px 10px;text-align:right">₽/м²</th><th style="padding:4px 10px;text-align:right">Сумма</th>
      </tr></thead><tbody>${posRows}</tbody>
    </table></div>` : ''}

  ${cmpRows ? `<div style="background:#13161b;border:1px solid #1f2330;border-radius:10px;padding:16px 20px;margin-bottom:16px">
    <div style="font-size:10px;color:#555d6e;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">Сравнение с рынком</div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead><tr style="color:#555d6e;font-size:10px">
        <th style="padding:4px 10px;text-align:left">Поставщик</th><th style="padding:4px 10px;text-align:left">Регион</th>
        <th style="padding:4px 10px;text-align:right">₽/м²</th><th style="padding:4px 10px;text-align:right">Экономия</th>
      </tr></thead><tbody>${cmpRows}</tbody>
    </table></div>` : ''}

  <div style="background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.3);border-radius:8px;padding:14px 16px;margin-bottom:10px;font-size:13px;line-height:1.6">
    ${a.conclusion||''}
  </div>
  <div style="background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.3);border-radius:8px;padding:14px 16px;font-size:13px;line-height:1.6">
    ${a.recommendation||''}
  </div>

  <div style="text-align:center;margin-top:20px;font-size:11px;color:#555d6e">
    sandwich-cfo.vercel.app · Аналитика рынка сэндвич-панелей ЦФО
  </div>
</div></body></html>`,
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
