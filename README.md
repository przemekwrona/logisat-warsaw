# logisat-warsaw

[![codecov](https://codecov.io/gh/przemekwrona/logisat-warsaw/graph/badge.svg?token=DQOLK347TY)](https://codecov.io/gh/przemekwrona/logisat-warsaw)

## Build with Docker

To build the project, start by installing dependencies:

```bash
npm install
```

Next, generate the Swagger dependency model.
This step requires the **Liquibase** package to be installed.
You can find installation instructions here: https://formulae.brew.sh/formula/liquibase

Run the update command:

```bash
liquibase update
````

Finally, start the database components and backend services using Docker:

```bash
docker compose up
```

After running this command, all required containers should start automatically.
If you want to rebuild containers from scratch, you can use:

```bash
docker compose up --build
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
