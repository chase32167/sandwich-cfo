# Инструкции для Claude — проект sandwich-cfo

## Язык общения

Отвечай на **русском языке** во всех ответах в этом проекте.

---

## Project overview

**СтройДата ЦФО** — веб-сервис анализа коммерческих предложений на сэндвич-панели для ЦФО (Центральный Федеральный Округ) России.

Пользователь загружает КП/счёт/спецификацию (xlsx, pdf, docx и др.) — сервис через Claude API парсит документ, извлекает позиции и цены, сравнивает с базой 36 реальных поставщиков ЦФО, выдаёт анализ: переплата/экономия, альтернативные поставщики, рекомендации с учётом НДС. Результат — полноэкранный интерактивный отчёт + PDF-скачивание + email клиенту.

**Живой сайт:** https://sandwich-cfo.vercel.app  
**Репозиторий:** https://github.com/chase32167/sandwich-cfo

### Структура файлов

```
index.html          — весь фронтенд (единый HTML, ~1400 строк, dark-тема)
api/analyze.js      — Vercel serverless function: парсинг файлов + Claude API + Resend email
package.json        — Node.js зависимости
vercel.json         — Vercel конфиг (maxDuration: 60s)
suppliers.js        — справочник поставщиков (не подключён к HTML, только справочник)
avito-data.js       — 50 объявлений Авито (справочник)
CONTEXT.md          — подробная база знаний проекта (поставщики, параметры рынка, история)
PLAYBOOK.md         — инструкция по добавлению новых данных и поставщиков
bug-lessons.md      — задокументированные баги и уроки
.env.example        — шаблон переменных окружения
```

---

## Стек

| Слой | Технология |
|---|---|
| Фронтенд | Vanilla HTML/CSS/JS, без фреймворка |
| Шрифт | Onest (Google Fonts) |
| PDF | html2pdf.js (html2canvas + jsPDF, CDN) |
| Хостинг | Vercel (Serverless Functions, Node.js) |
| Бэкенд | Vercel Serverless (`api/analyze.js`, CommonJS) |
| AI | Anthropic Claude API (`claude-sonnet-4-6`, `max_tokens: 4096`) |
| Парсинг файлов | `xlsx` (Excel/CSV), `mammoth` (Word), Claude document API (PDF) |
| Email | Resend (`hi@ad-unicorn.ru` → клиент) |
| Деплой | GitHub → Vercel автодеплой при push в `main` |

**Зависимости (`package.json`):**
- `@anthropic-ai/sdk` ^0.52.0
- `xlsx` ^0.18.5
- `mammoth` ^1.8.0
- `resend` ^4.0.0

---

## Переменные окружения

Задаются в Vercel Dashboard (Settings → Environment Variables) или через `.env.local` локально.

| Переменная | Обязательность | Описание |
|---|---|---|
| `ANTHROPIC_API_KEY` | **Обязательно** | API-ключ Anthropic для вызова Claude |
| `RESEND_API_KEY` | Опционально | API-ключ Resend для отправки email клиенту. Если не задан — анализ работает, письмо не отправляется |

Шаблон: `.env.example`

---

## Важные технические детали

- `claude-sonnet-4-6` **не поддерживает assistant message prefill** — нельзя добавлять `{role:'assistant'}` в messages
- PDF отправляются как `document` блоки через Claude Document API (base64), не извлекается текст
- Лимит текста для xlsx/docx: 12 000 символов на файл (обрезается с пометкой)
- Лимит файлов: до 4 × 10 МБ
- Email вёрстка: table-based (не grid/flexbox), светлая тема — для совместимости с почтовыми клиентами
- PDF генерируется клиентски через `buildPDFHtml()` + html2pdf.js на белом фоне (не скриншот UI)
- Имя PDF файла: `Анализ_КП_[поставщик].pdf`
- Ошибки показываются inline (div #analyzeError), не через `alert()`
