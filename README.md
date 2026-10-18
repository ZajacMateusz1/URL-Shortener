# URL Shortener

A TypeScript URL-shortening API built with Express, PostgreSQL, Redis, JWT
authentication, and Prisma ORM for PostgreSQL.

## Features

- User signup and login
- HTTP-only cookie authentication
- Argon2 password hashing
- Email verification and password-reset flows through Resend
- Short URL generation with collision handling
- URL expiration after 14 days
- Redis caching for redirects
- Request validation with Zod
- Vitest and Supertest integration tests

## Requirements

- Node.js 24 or newer
- PostgreSQL 15 or newer
- Redis 7 or newer
- npm

Docker users can start PostgreSQL, Redis, and the backend with the included
[`compose.yaml`](./compose.yaml). The Compose configuration expects a `.env`
file in the project root.

## Installation

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Then replace every placeholder in `.env`. The application validates all
required variables when its configuration is loaded.

### Environment variables

| Variable         | Description                                      |
| ---------------- | ------------------------------------------------ |
| `DATABASE_URL`   | PostgreSQL connection URL                        |
| `JWT_SECRET`     | Secret used to sign authentication tokens        |
| `RESEND_API_KEY` | Resend API key used for email delivery           |
| `APP_BASE_URL`   | Public base URL used to build email links        |
| `REDIS_URL`      | Redis connection URL                             |
| `ENVIRONMENT`    | One of `development`, `test`, or `production`    |
| `DB_USER`        | PostgreSQL user used by Docker Compose           |
| `DB_PASSWORD`    | PostgreSQL password used by Docker Compose       |
| `DB_NAME`        | Development database name used by Docker Compose |
| `DB_NAME_TEST`   | Test database name used by Docker Compose        |

For local development with the application running directly on your host,
the database and Redis URLs should use host ports, for example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/mydb"
REDIS_URL="redis://localhost:6379"
```

When the backend runs inside Docker Compose, use service names instead:

```env
DATABASE_URL="postgresql://postgres:password@db:5432/mydb"
REDIS_URL="redis://redis:6379"
```

For tests, use the separate [`.env.test`](./.env.test) configuration. It
points to the test database and Redis database. The test database is exposed
on host port `5434`.

## Database and Prisma

The database contract is defined in
[`src/prisma/contract.prisma`](./src/prisma/contract.prisma). Generated
contract files are kept in [`src/prisma`](./src/prisma).

After changing the contract, regenerate the typed contract:

```bash
npm run contract:emit
```

Database migrations are stored in [`migrations/app`](./migrations/app). Make
sure PostgreSQL is running and `DATABASE_URL` points to the intended database
before applying migrations. Apply the existing migrations with:

```bash
dotenv run -f .env -- sh -c 'npx prisma db migrate --db "$DATABASE_URL" --advance-ref db'
```

Use `--advance-ref db-test` with the test database. The exact migration command
may vary with the Prisma CLI version; see [`prisma-8.md`](./prisma-8.md) for
the project-specific Prisma 8 workflow.

## Running locally

Start the development server with watch mode:

```bash
npm run dev
```

The API listens on [http://localhost:5000](http://localhost:5000).

Health check:

```bash
curl http://localhost:5000/health
```

Build and run the production-style Node.js process:

```bash
npm run build
npm start
```

## Docker Compose

Create `.env` first and use container service names in `DATABASE_URL` and
`REDIS_URL`, as described above. Then start the development stack:

```bash
docker compose up --build
```

On a fresh database, apply migrations from the host after the database service
is healthy:

```bash
dotenv run -f .env -- sh -c 'npx prisma db migrate --db "$DATABASE_URL" --advance-ref db'
```

The backend image does not apply migrations automatically during startup.

The services use these host ports:

| Service         | Host port |
| --------------- | --------: |
| Backend         |    `5000` |
| PostgreSQL      |    `5433` |
| Test PostgreSQL |    `5434` |
| Redis           |    `6379` |

Stop the stack:

```bash
docker compose down
```

Add `-v` only when you intentionally want to remove the persisted database
and Redis volumes.

## API

### Health

```http
GET /health
```

Returns:

```json
{
  "status": "ok"
}
```

### Authentication

| Method | Endpoint                          | Description                               |
| ------ | --------------------------------- | ----------------------------------------- |
| `POST` | `/api/auth/signup`                | Create a user and send verification email |
| `POST` | `/api/auth/login`                 | Authenticate and set the `token` cookie   |
| `POST` | `/api/auth/logout`                | Clear the authentication cookie           |
| `GET`  | `/api/auth/verify-email/:token`   | Verify an email address                   |
| `POST` | `/api/auth/verify-email/resend`   | Resend a verification email               |
| `POST` | `/api/auth/reset-password`        | Send a password-reset email               |
| `POST` | `/api/auth/reset-password/:token` | Set a new password using a reset token    |

Signup expects an email, password, and username. Login expects an email and
password. Passwords must be 8–64 characters and contain an uppercase letter,
a number, and a special character.

Signup and login set the `token` value in an HTTP-only cookie. The token is not
returned in the JSON response. Email verification is supported, but the
current authentication flow does not block login or URL creation for users who
have not verified their email address.

### URL shortening

Create a short URL. This endpoint requires the `token` HTTP-only cookie:

```http
POST /api/urls/shorten
Content-Type: application/json

{
  "originalUrl": "https://example.com"
}
```

Successful responses contain the generated short URL and expiration time:

```json
{
  "shortUrl": "abc123",
  "longUrl": "https://example.com",
  "ownerId": 1,
  "expiresAt": "2026-11-01T12:00:00.000Z"
}
```

Redirect to the original URL:

```http
GET /api/urls/:shortUrl
```

Short URLs expire 14 days after creation. Expired links return HTTP `410`.
Redirects are cached in Redis. URL creation and redirects are rate-limited per
client IP.

## Testing

Tests require the test PostgreSQL and Redis services configured in
[`.env.test`](./.env.test). Start the required services with:

```bash
docker compose up -d db-test redis
```

Apply the migrations to the test database before the first test run:

```bash
dotenv run -f .env.test -- sh -c 'npx prisma db migrate --db "$DATABASE_URL" --advance-ref db-test'
```

Run the complete test suite once:

```bash
npm test -- --run
```

Run Vitest in watch mode:

```bash
npm test
```

The current test suite covers signup, login, authentication, URL shortening,
redirects, rate limiting, and basic validation.

## Project structure

```text
src/
├── config/          Environment and Redis configuration
├── errors/          Application error types
├── middleware/      Authentication, validation, and error handling
├── modules/
│   ├── auth/        Authentication services, routes, and repositories
│   ├── email/       Email sending and templates
│   └── url/         URL shortening and redirect logic
├── prisma/          Database contract and generated types
├── utils/           Shared utilities
├── app.ts           Express application
└── server.ts        Server startup
tests/               Integration tests and fixtures
migrations/          Prisma database migrations and snapshots
```

## Error responses

Validation errors return HTTP `422` with field-level details. Application
errors include an `error` message and may include a `details` object:

```json
{
  "error": "Validation error",
  "details": {
    "formErrors": [],
    "fieldErrors": {
      "email": ["Incorrect email format"]
    }
  }
}
```
