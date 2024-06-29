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

## Concepts

This project uses so-called slug values (string alias as unique value). They are used as an identifier for some entities (projects, columns).
The original slug values ​​can also be substituted into the request path, because the server will always attempt to cast the required user input into a slug value.

### Slug core rules

- _all whitespaces replaced with dash symbol_
- _every word in lowercase_

**For example**

`/api/projects/my-project/columns/to-do`

is equal to

`/api/projects/My project/columns/To Do`

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
