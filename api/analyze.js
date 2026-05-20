const Anthropic = require('@anthropic-ai/sdk');
const XLSX = require('xlsx');
const mammoth = require('mammoth');

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
    return res.status(200).json({ success: true, analysis });

  } catch (err) {
    console.error('analyze error:', err);
    return res.status(500).json({ error: err.message || 'Ошибка анализа' });
  }
};
