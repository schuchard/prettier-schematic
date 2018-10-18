# Angular Prettier schematic

A Schematic that adds prettier and a pre-commit hook for formatting staged files.

[![CircleCI](https://circleci.com/gh/schuchard/prettier-schematic.svg?style=svg)](https://circleci.com/gh/schuchard/prettier-schematic)
[![npm](https://img.shields.io/npm/v/@schuchard/prettier.svg)](https://www.npmjs.com/package/@schuchard/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Usage 🚀

Install globally

```shell
npm install -g @schuchard/prettier
```

Run in an Angular CLI root directory:

```shell
ng g @schuchard/prettier:add
```

## How does Prettier work with Angular

### Automatically with lint-staged

By default [lint-staged](https://github.com/okonet/lint-staged) is [configured](https://prettier.io/docs/en/precommit.html#option-1-lint-staged-https-githubcom-okonet-lint-staged) along with a pre-commit hook. This will run Prettier against all new files as they are committed according to the settings defined in `prettier.config.json`. Generally speaking, your workflow should remain unchanged - `git add, commit, push`

![lint-staged-example](docs/prettier-vsc-term-600.gif)

#### Disabling lint-staged install

lint-stage and the precommit hook can be disabled with the following

```shell
ng g @schuchard/prettier:add --lintStaged=false
```

### Manually

While lint-staged only runs prettier against staged files, you can manually run Prettier against **ALL** typescript files with the script added to the `package.json`

`npm run prettier`

## Defaults Prettier options

### Angular 7

This schematic takes advantage of CLI [prompts](https://github.com/angular/angular-cli/blob/fb4e8187824fe66e50b42c16f95458e82b4787a8/docs/specifications/schematic-prompts.md) for configuring Prettier options. If you're unsure of a setting, press enter to select the default. You can skip a prompt by passing any of the options when call the schematic.

```ng g @schuchard/prettier:add --printWidth=100```

![schematic-cli](docs/prettier-schematic-cli.gif)

### < Angular 7

Without any CLI arguments the [default](https://prettier.io/docs/en/options.html) Prettier options will be applied. The defaults can be changed in one of two ways:

- modifying the `./prettier.config.js` after the schematic runs
- passing a flag to the schematic with the desired value for any of the options. For example:
  - `ng g @schuchard/prettier:add --printWidth=100 --tabWidth=4`

### Example default `prettier.config.js`

```json
printWidth = 80;
tabWidth = 2;
useTabs = false;
semi = true;
singleQuote = false;
trailingComma = "none";
bracketSpacing = true;
jsxBracketSameLine = false;
arrowParens = "avoid";
rangeStart = 0;
rangeEnd = Infinity;
requirePragma = false;
insertPragma = false;
proseWrap = "preserve";
lintStaged = true;
```

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

## Documentation

Unsure how to do something with schematics? Check the Angular [schematics](https://github.com/angular/angular-cli/tree/master/packages/schematics/angular) for inspiration.

Inspiration came from this excellent article by [Aaron Frost](https://medium.com/ngconf/ultimate-prettier-angular-cheatsheet-777c9515f4fb)

## Publishing

- First, ensure you're authenticated with `npm login`.

```shell
npm run release
```

## Issues & Requests 📬

Submit an [issue](https://github.com/schuchard/prettier-schematic/issues/new/choose)