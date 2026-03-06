# 🔑 OpenAI API Subscription Checker

Проверьте тип вашей подписки OpenAI API по доступным моделям.

![Preview](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)

## ✨ Возможности

- 🔍 Проверка 65+ моделей OpenAI (GPT-5, GPT-4, O-серия, DALL-E, Sora, Whisper, TTS)
- 💰 Определение тарифа по деньгам ($5, $50, $100, $250, $1000+)
- 🌍 Русский и английский интерфейс
- 🎨 Красивый тёмный дизайн с анимациями
- 📊 Подробная статистика по всем моделям
- 🔒 API ключ обрабатывается только в вашем браузере

## 🚀 Быстрый деплой

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/openai-api-checker)

1. Нажмите кнопку выше или зайдите на [vercel.com](https://vercel.com)
2. Импортируйте репозиторий
3. Vercel автоматически определит настройки из `vercel.json`
4. Нажмите Deploy!

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/openai-api-checker)

1. Нажмите кнопку или зайдите на [netlify.com](https://netlify.com)
2. Импортируйте репозиторий
3. Настройки автоматически подтянутся из `netlify.toml`

### Railway
1. Зайдите на [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Настройки из `railway.json` подтянутся автоматически

### Render
1. Зайдите на [render.com](https://render.com)
2. New → Static Site
3. Подключите репозиторий
4. Настройки из `render.yaml` подтянутся автоматически

### Docker
```bash
# Сборка образа
docker build -t openai-checker .

# Запуск
docker run -p 8080:80 openai-checker
```

### Fly.io
```bash
flyctl launch
flyctl deploy
```

## 🛠 Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Превью сборки
npm run preview
```

## 📁 Структура проекта

```
├── src/
│   ├── App.tsx          # Основной компонент
│   ├── translations.ts  # Переводы RU/EN
│   └── main.tsx         # Точка входа
├── vercel.json          # Конфиг Vercel
├── netlify.toml         # Конфиг Netlify
├── railway.json         # Конфиг Railway
├── render.yaml          # Конфиг Render
├── fly.toml             # Конфиг Fly.io
├── Dockerfile           # Docker образ
└── README.md
```

## 💰 Тарифы OpenAI (определяются автоматически)

| Тариф | Сумма | Доступные модели |
|-------|-------|------------------|
| **Tier 5** | $1,000+ | GPT-5 Pro, O3-Pro, O1-Pro |
| **Tier 4** | $250+ | GPT-5, GPT-5.1, GPT-5.2, O3, O1, Sora-2 |
| **Tier 3** | $100+ | GPT-4.1, GPT-4o, GPT-4-Turbo, GPT-5-mini |
| **Tier 2** | $50+ | GPT-4, GPT-4o-mini, GPT-4.1-mini, O1-mini |
| **Tier 1** | $5+ | GPT-3.5, Embeddings, Whisper, TTS |
| **Free** | $0 | Ограниченный доступ |

## 🔒 Безопасность

- API ключ **НЕ отправляется** на наши сервера
- Все запросы идут напрямую к `api.openai.com`
- Ключ обрабатывается только в вашем браузере
- Исходный код открыт для проверки

## 📝 Лицензия

MIT License - используйте как хотите!

## 🤝 Contributing

Pull requests приветствуются! Для крупных изменений сначала откройте issue.

---

Made with ❤️ and ☕
