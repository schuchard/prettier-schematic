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
  return Object.entries(defaultSettings).reduce((acc: any, [key, defaultValue]) => {
    const cliValue = cliOptions[key];
    if (cliValue !== undefined) {
      // modify default option with cli value
      context.logger.debug(`changin ${key} default to: ${cliValue}`);

      acc[key] = wrapAsString(key, cliValue);
    } else {
      // use default option
      acc[key] = wrapAsString(key, defaultValue);
    }

    return acc;
  }, {});
}

function wrapAsString(key: any, value: any): boolean {
  const hasStringValue = ['trailingComma', 'arrowParens', 'parser', 'filepath', 'proseWrap'].some(
    (value) => key == value
  );
  return hasStringValue ? `"${value}"` : value;
}
