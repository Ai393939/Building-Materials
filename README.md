# Building-Materials
BuildMart — интернет-магазин строительных материалов. Учебный проект интернет-магазина, разработанный в рамках практического задания по предмету "Оптимизация и обеспечение безопасности web-приложений". Реализован на чистом JavaScript с использованием локального хранилища для корзины.

Технологии

- HTML5
- CSS3 (Flexbox, Grid, адаптивная верстка)
- JavaScript (ES6+)
- LocalStorage (сохранение корзины)
- JSON (база данных товаров)

Функциональность

- Каталог товаров с фильтрацией по цене и рейтингу
- Сортировка товаров (по имени, по цене)
- Страница товара с галереей изображений и аккордеоном
- Корзина с изменением количества, удалением товаров и промокодом
- Адаптивная верстка (от 375px до 1440px)

## Сервер

API на NestJS, TypeORM и PostgreSQL. Каталог кэшируется в Redis. Картинки товаров в сиде пока стоят на placehold.co: после загрузки в Cloudinary их нужно заменить в `server/src/products/seed-data.ts`, функция `imagesFor`.

### Локальный запуск

Из корня репозитория:

```bash
cp server/.env.example server/.env
docker compose up --build
```

В другом терминале, когда контейнеры поднялись:

```bash
cd server
npm install
npm run build
npm run seed
```

Сид создаёт товары, админа `admin@example.com` / `admin12345` и промокод `SAVE10`. Повторный запуск не дублирует уже существующие записи.

Проверка:

```bash
curl http://localhost:3000/health
```

Swagger: http://localhost:3000/api/docs

Контейнер приложения собирается в три стадии и запускается от пользователя `node`.

### Переменные окружения

| Переменная | Зачем |
|---|---|
| `PORT` | Порт API |
| `NODE_ENV` | `development` включает synchronize у TypeORM, `production` выключает |
| `DATABASE_URL` | PostgreSQL. Локально это сервис из compose, на Render — строка Neon |
| `DATABASE_SSL` | `true` для Neon, `false` для локального Postgres |
| `REDIS_URL` | Redis |
| `JWT_SECRET` | Секрет подписи токена |
| `JWT_EXPIRES_IN` | Срок жизни токена, например `7d` |
| `CORS_ORIGIN` | Адрес фронтенда. Несколько адресов можно перечислить через запятую |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary |
| `CLOUDINARY_API_KEY` | Cloudinary |
| `CLOUDINARY_API_SECRET` | Cloudinary |

Файл `server/.env` в git не попадает. На Render те же имена задаются в панели сервиса.

### Деплой

- Облачная база: Neon
- Картинки: Cloudinary
- API: Render, сборка из `server/Dockerfile`
- Публичный API: заполнится после деплоя
- Swagger: заполнится после деплоя, путь `/api/docs`
