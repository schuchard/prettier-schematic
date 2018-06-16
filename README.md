# Angular Prettier schematic

🚀 This repository is a Angular CLI schematic that adds Prettier to an Angular project.

[![CircleCI](https://circleci.com/gh/schuchard/prettier-schematic.svg?style=svg)](https://circleci.com/gh/schuchard/prettier-schematic)
[![npm](https://img.shields.io/npm/v/@schuchard/prettier.svg)](https://www.npmjs.com/package/@schuchard/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Contributing

### Getting started

Install dependencies:

```shell
yarn && cd sandbox && yarn
```

Link schematic to sandbox app. Schematic commands in the sandbox will use this local repo schematic.

```shell
yarn link && yarn link:sandbox
```

### Committing ✅

This repo uses semantic-release and relies on [formatted](https://github.com/semantic-release/semantic-release#commit-message-format) commit messages for determining the next version. After staging changes, build the commit message with commitizen:

```shell
yarn cm
```

### Publishing 🎉

Publishes are managed in CircleCI on merges into master. See the commit message [docs](https://github.com/semantic-release/semantic-release#commit-message-format) on how to trigger a new NPM publish and version.

## Documentation

Unsure how to do something with schematics? Check the Angular [schematics](https://github.com/angular/angular-cli/tree/master/packages/schematics/angular) for inspiration.