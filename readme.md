# @start

👉 This is a next iteration which is currently a WORK IN PROGRESS, you might want to check old [runner implementation](https://github.com/deepsweet/start/tree/old) and its [plugins](https://github.com/start-runner).

* [x] API experiments
* [ ] make sure that it works in "strict" ESM
* [ ] stabilize and publish 0.1.0 of everything
* [ ] tests
* [ ] documentation
  * [ ] main readme
  * [ ] recipes

## Example

"Pack" 2 packages in parallel child processes: transpile and generate type definitions in parallel child-child processes with concurrently running promises inside of each process:

```
packages/
├── foo/
│   ├── build/
│   │   └── index.mjs
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── readme.md
└── bar/
    ├── build/
    │   └── index.mjs
    ├── src/
    │   └── index.ts
    ├── package.json
    └── readme.md
```

```js
export const build = (packageName) =>
  sequence(
    find(`packages/${packageName}/src/**/*.ts`),
    read,
    babel({ ...babelConfig, babelrc: false }),
    rename((file) => file.replace(/\.ts$/, '.mjs')),
    write(`packages/${packageName}/build/`)
  )
```

```sh
$ yarn start build foo
```

```js
export const dts = (packageName: string) =>
  sequence(
    find(`packages/${packageName}/src/**/*.ts`),
    typescriptGenerate(`packages/${packageName}/build/`, [
      '--lib',
      'esnext',
      '--allowSyntheticDefaultImports'
    ])
  )
```

```sh
$ yarn start dts foo
```

```js
export const pack = (packageName: string) =>
  sequence(
    assert(packageName, 'package name is required'),
    find(`packages/${packageName}/build/`),
    remove,
    parallel(['build', 'dts'])(packageName)
  )
```

```sh
$ yarn start pack foo
```

```js
export const packs = xargs('pack')
```

```sh
$ yarn start packs foo bar
```

## Packages

### Core

| Name                                                         | Description                                                                  |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| ⏩ [plugin-sequence](packages/plugin-sequence)               | Runs plugins in sequence                                                     |
| 🔀 [plugin-parallel](packages/plugin-parallel)               | Runs tasks in parallel with same agruments                                   |
| 🔂 [plugin-xargs](packages/plugin-xargs)                     | Runs task in parallel for each argument                                      |
| 🐣 [plugin-spawn](packages/spawn)                            | Spawns new child process                                                     |
| ⬛️ [cli-esm](packages/cli-esm)                              | Runs tasks file or preset, uses `start` field in `package.json` for settings |
| 📄 [reporter-verbose](packages/reporter-verbose)             | Verbose reporter                                                             |
| 👔 [plugin-env](packages/plugin-env)                         | Sets `process.env`                                                           |
| 🔍 [plugin-find](packages/plugin-find)                       | Finds files using glob patterns                                              |
| 🔍 [plugin-find-git-staged](packages/plugin-find-git-staged) | Finds staged in Git files and filters it using glob patterns                 |
| 📖 [plugin-read](packages/plugin-read)                       | Reads files content                                                          |
| 🔠 [plugin-rename](packages/plgun-rename)                    | Renames files                                                                |
| ❌ [plugin-remove](packages/plugin-remove)                   | Removes files or directories                                                 |
| 👯 [plugin-copy](packages/plugin-copy)                       | Copies files to relative destination preserving nested folders structure     |
| ✏️ [plugin-write](packages/plugin-write)                     | Writes files to relative destination preserving nested folders structure     |
| ✏️ [plugin-overwrite](packages/plugin-overwrite)             | Overwrites files                                                             |
| 👀 [plugin-watch](packages/plugin-watch)                     | Watches for new or changed files matched by globs patterns                   |
| 🔌 [plugin-input](packages/plugin-input)                     | Connects external input into a task flow                                     |

### Lib

#### Build and bundle

| Name                                                             | Description                                                 |
| ---------------------------------------------------------------- | ----------------------------------------------------------- |
| 🏭 [plugin-lib-babel](packages/plugin-lib-babel)                 | Transpiles files data using Babel                           |
| 🏭 [plugin-lib-webpack](packages/plugin-lib-webpack)             | Bundles files using Webpack                                 |
| 🏭 [plugin-lib-webpack-serve](packages/plugin-lib-webpack-serve) | Runs Webpack development server                             |
| 🏭 plugin-lib-postcss                                            | [To be migrated](https://github.com/start-runner/postcss)   |
| 🏭 plugin-lib-less                                               | [To be migrated](https://github.com/start-runner/less)      |
| 🏭 plugin-lib-clean-css                                          | [To be migrated](https://github.com/start-runner/clean-css) |
| 🏭 plugin-lib-uglify                                             | [To be migrated](https://github.com/start-runner/uglify)    |

#### Tests

| Name                                                    | Description                                                    |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| ✅ [plugin-lib-jest](packages/plugin-lib-jest)          | Runs tests using Jest                                          |
| ✅ [plugin-lib-tape](packages/plugin-lib-tape)          | Runs tests using Tape                                          |
| ✅ plugin-lib-ava                                       | [To be migrated](https://github.com/start-runner/ava)          |
| ✅ plugin-lib-mocha                                     | [To be migrated](https://github.com/start-runner/mocha)        |
| ✅ plugin-lib-karma                                     | [To be migrated](https://github.com/start-runner/karma)        |
| 💯 [plugin-lib-instanbul](packages/plugin-lib-istanbul) | Instruments, collects and reports code coverage using Istanbul |

#### Lint and codestyle

| Name                                                                 | Description                              |
| -------------------------------------------------------------------- | ---------------------------------------- |
| 🚷 [plugin-lib-eslint](packages/plugin-lib-eslint)                   | Lints files with ESlint                  |
| 🚷 [plugin-lib-flow-check](packages/plugin-lib-flow-check)           | Checks types with Flow                   |
| 💄 [plugin-lib-prettier-eslint](packages/plugin-lib-prettier-eslint) | Fixes code(style) with Prettier + ESLint |

#### CI and publish

| Name                                                         | Description                                                 |
| ------------------------------------------------------------ | ----------------------------------------------------------- |
| 💯 [plugin-lib-codecov](packages/plugin-lib-codecov)         | Sends coverage info to codecov.io                           |
| 💯 plugin-lib-coveralls                                      | [To be migrated](https://github.com/start-runner/coveralls) |
| 🔢 [plugin-lib-npm-version](packages/plugin-lib-npm-version) | Bumps package version                                       |
| 📦 [plugin-lib-npm-publish](packages/plugin-lib-npm-publish) | Publishes package to NPM                                    |
