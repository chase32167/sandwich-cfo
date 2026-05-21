# Bug Lessons — sandwich-cfo

## 2026-05-21 — Vercel timeout 30s при анализе 4 файлов

- **Симптом**: alert «Ошибка: JSON.parse: unexpected character at line 1 column 1» после ~32 секунд ожидания
- **Корневая причина**: `maxDuration: 30` в vercel.json — функция убивалась Vercel-ом на 30-й секунде, возвращала HTML-страницу ошибки вместо JSON; `resp.json()` на фронтенде падал с SyntaxError
- **Фикс**: vercel.json `maxDuration: 30 → 60`; fetch теперь читает `resp.text()` и оборачивает `JSON.parse` в try/catch с понятным сообщением
- **Урок**: при обработке нескольких файлов с LLM всегда закладывать запас по таймауту (4 PDF-файла + Claude = 30–60с). Фронтенд никогда не должен вызывать `resp.json()` напрямую — сначала `text()`, потом безопасный `JSON.parse`.

## 2026-05-21 — JSON обрезается на позиции 5878 символов (max_tokens: 3000)

- **Симптом**: «Expected ',' or ']' after array element in JSON at position 5878» — ответ обрывался посередине массива
- **Корневая причина**: `max_tokens: 3000` в вызове Claude API — модель генерировала JSON, который не влезал в 3000 токенов (~5878 символов), и ответ обрезался посередине JSON-структуры
- **Фикс**: `max_tokens: 3000 → 4096`; добавлен assistant prefill `{ role: 'assistant', content: '{' }` чтобы Claude генерировал только JSON без markdown-обёртки; парсинг: `raw = '{' + message.content[0].text`
- **Урок**: для JSON-ответов с массивами (positions + marketComparison могут быть большими) нужен запас max_tokens. Assistant prefill с `{` надёжно убирает markdown и исключает текст вне JSON.
