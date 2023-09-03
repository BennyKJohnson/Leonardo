## Setup

### Environment variables
Environment variables such as credentials are included in the .env file. To use the example .env which includes database connection url to docker postgres db, run the following command:
```bash
cp .env.example .env
``` 
### Node module installation
- The app requires Node version 18. Install required packages with the following command:
```bash
$ npm install
```
### Database setup
A postgres database server is required to run the app. This is included in docker compose
```bash
$ docker compose up
```
Migrate the database and seed data with:
```bash
$ npm run migrate 
$ npm run seed
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Troubleshooting
```
PrismaClientInitializationError: Can't reach database server at `localhost`:`5432`
```
- Postgres server is not running or your .env `DATABASE_URL` is incorrect