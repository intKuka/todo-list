## Usings

- NodeJS v20.10.0
- PostgreSQL
- Prisma ORM

## Installation

```bash
$ npm install
```

## Setting & Configuration

Need to create and configure .env file

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Prisma

If you need prisma client UI use:

```bash
 $ npm run studio:dev
```

## Docker compose

If you need DB instance you may have it via running the compose file

```bash
# in the project root
$ docker compose up --build
```
