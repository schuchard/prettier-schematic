export interface Schema {
  // Specify the line length that the printer will wrap on.
  printWidth?: number;

  // Specify the number of spaces per indentation-level.
  tabWidth?: boolean;

  // Indent lines with tabs instead of spaces.
  useTabs?: boolean;

  // Print semicolons at the ends of statements.
  semi?: true;

  // Use single quotes instead of double quotes.
  singleQuote?: boolean;

  // Print trailing commas wherever possible when multi-line. (A single-line array, for example, never gets trailing commas.)
  trailingComma?: string;

  // Print spaces between brackets in object literals.
  bracketSpacing?: true;

  // Put the > of a multi-line JSX element at the end of the last line instead of being alone on the next line (does not apply to self closing elements).
  jsxBracketSameLine?: boolean;

  // Include parentheses around a sole arrow function parameter.
  arrowParens?: string;

  // Format only a segment of a file.
  rangeStart?: number;

  // Format only a segment of a file.
  rangeEnd?: Infinity;

  // Prettier can restrict itself to only format files that contain a special comment, called a pragma, at the top of the file. This is very useful when gradually transitioning large, unformatted codebases to prettier.
  requirePragma?: boolean;

  // Prettier can insert a special @format marker at the top of files specifying that the file has been formatted with prettier. This works well when used in tandem with the --require-pragma option.
  insertPragma?: boolean;

  // By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer, e.g. GitHub comment and BitBucket. In some cases you may want to rely on editor/viewer soft wrapping instead, so this option allows you to opt out with \"never\".
  proseWrap?: string;

  // Run Prettier against staged git files.
  lintStaged?: boolean;

  // Format all Angular Files
  formatAllAngularFiles: boolean
}
