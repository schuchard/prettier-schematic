import { SchematicContext } from '@angular-devkit/schematics';

export interface PrettierOptions {
  printWidth?: number;
  tabWidth?: number;
  useTabs?: boolean;
  semi?: boolean;
  singleQuote?: boolean;
  trailingComma?: 'none' | 'es5' | 'all';
  bracketSpacing?: boolean;
  jsxBracketSameLine?: boolean;
  arrowParens?: 'avoid' | 'always';
  rangeStart?: number;
  rangeEnd?: number;
  parser?: 'babylon' | 'flow' | 'typescript' | 'postcss' | 'json' | 'graphql' | 'markdown';
  filepath?: string;
  requirePragma?: boolean;
  insertPragma?: boolean;
  proseWrap?: 'preserve' | 'always' | 'never';
  [index: string]: any;
}

export class PrettierSettings implements PrettierOptions {
  printWidth = 80;
  tabWidth = 2;
  useTabs = false;
  semi = true;
  singleQuote = false;
  trailingComma = 'none' as 'none';
  bracketSpacing = true;
  jsxBracketSameLine = false;
  arrowParens = 'avoid' as 'avoid';
  rangeStart = 0;
  rangeEnd = Infinity;
  // parser: ''; // No default
  // filepath: ''; // No default
  requirePragma = false;
  insertPragma = false;
  proseWrap = 'preserve' as 'preserve';
}

export function getDefaultOptions(
  context: SchematicContext,
  cliOptions: PrettierOptions,
  defaultSettings: PrettierSettings
): PrettierOptions {
  return Object.entries(defaultSettings).map(([key, value]) => {
    if (cliOptions[key] !== undefined) {
      context.logger.info(`add ${key} setting`);

      return {
        key,
        value: cliOptions[key],
      };
    } else {
      return { key, value };
    }
  });
}
