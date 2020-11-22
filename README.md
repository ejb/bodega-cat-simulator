# Bodega Cat Simulator

An open source game made during [Replay Game Jam](https://itch.io/jam/replay-game-jam).

## Audio credits

Music: [Chipho by RoccoW](https://roccow.bandcamp.com/track/chipho)

Sound effects:

- https://freesound.org/people/Zabuhailo/sounds/146968/
- https://freesound.org/people/Breviceps/sounds/445958/
- https://freesound.org/people/MATRIXXX_/sounds/515823/
- https://freesound.org/people/Piotr123/sounds/474094/
- https://freesound.org/people/AlienXXX/sounds/150384/
- https://freesound.org/people/dwsolo/sounds/24021/
- https://freesound.org/people/jdaniel1999/sounds/376205/

## Structure

- `assets`: Assets like audio and images go here. Nested folders are not currently supported.
- `src`: Where your game code and tests go.
- `swift`: Code specific to deploying to iOS goes here, such as your Xcode project.
- `web`: Code specific to deploying to web goes here. You can edit the web load screen too.
- `.eslintignore` / `.eslintrc.js`: Configure your linting rules.
- `.gitignore`: List of files to ignore in git.
- `babel.config.js`: Config for Babel compiler.
- `jest.config.js`: Config file for Jest tests.
- `package.json` / `package-lock.json`: Manage dependencies of your project.

## Setup

```bash
npm install
```

## Development

```bash
npm start
```

Runs your game locally in the browser using [webpack-dev-server](https://github.com/webpack/webpack-dev-server). Will auto-refresh on changes.

> Note: if you add or rename audio and image assets, you need to restart the dev server.

## Lint files

```bash
npm run lint
```

Lints your code using [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for formatting. Edit [.eslintrc.js](./.eslintrc.js) to change lint rules.

## Test

```bash
npm run test

# or watch for file changes
npm run test:watch
```

Runs tests using Jest. Will look out for files of name `*.test.js` in a `__tests__` directory.

## Build for web

```bash
npm run build-web
```

Creates an HTML, JS and assets bundle in `web/dist`. You can then deploy this somewhere to share with the world!

Play the build locally with

```bash
npm run serve
```

## Run on iOS

```bash
open swift/replay-starter-ts.xcodeproj/
# run in Xcode
```

Assets like audio and images need to be dragged into your Xcode project.
