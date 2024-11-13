## Message service

### Stack

- Typescript
- Hono - Web server
- Zod - Schema Validation
- Postgresql - Database
- Drizzle - ORM
- OpenAPI & Scalar - API docs
- Stoker - OpenAPI Utils
- Pino - Logger
- Jwt - Authentication

To run the project use docker compose up to run the web server and postgres in containers

### Features

1. Enabled logging based on node environment and uses standard logging library so it is easy to send logs to platform such as elastic search, new relic, etc
2. End to end type safety with zod
3. API documentation with ability to try apis from the docs using OpenAPI standard and Scalar - visit /reference route to see the documentation
4. Local database visualisation using drizzle studio

### Run with docker

1. Run below command

```sh
docker compose up
```

2. Visit http://localhost:4000/reference to see the API documentation

### To Run locally

1. Setup a postgres database using docker

```sh
docker pull postgres:15
```

To run

```sh
docker run --name chat-postgres -e POSTGRES_PASSWORD=mypassword -d -p 5432:5432 postgres
```

2. Update env file with database url

```sh
DATABASE_URL=postgres://postgres:mypassword@localhost:5432/postgres
JWT_SECRET=secret
```

3. Generate Postgres Schema

```
pnpm db:push
```

4. Run Drizzle Studio to view tables

```
pnpm db:studio
```

5. Run Server in dev more

```
pnpm install
pnpm dev
```

To run in production

```
pnpm install
pnpm build
pnpm start
```

6. Visit docs open - http://localhost:3000/reference in browser

### Screen recording of docs