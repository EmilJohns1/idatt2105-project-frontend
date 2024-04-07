# IDATT2105-PROJECT-FRONTEND
Frontend repository for voluntary project in IDATT2105 full-stack application development

# idatt2105-project-frontend

For information about how to run the project as a whole, see the full project documentation [here](https://github.com/1Cezzo/idatt2105-project-backend)
To be able to communicate with the backend of this project using https, you need to create a folder named "certs" in the root directory and store your certificates here.

## Frontend setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
