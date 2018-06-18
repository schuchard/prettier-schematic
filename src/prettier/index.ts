import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  apply,
  url,
  template,
  move,
  mergeWith,
} from '@angular-devkit/schematics';
import { Observable, of } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';

import {
  PrettierOptions,
  getDefaultOptions,
  PrettierSettings,
  removeConflictingTsLintRules,
} from '../utility/prettier-util';
import { addPackageJsonDependency, NodeDependencyType } from '../utility/dependencies';
import { getLatestNodeVersion, NpmRegistryPackage, getFileAsJson } from '../utility/util';

export default function(options: PrettierOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const cliOptions = getDefaultOptions(context, options, new PrettierSettings());

    return chain([
      addDependencies(),
      addPrettierFiles(cliOptions),
      modifyTsLint(),
      updateEditorConfig(cliOptions),
    ])(tree, context);
  };
}

function addDependencies(): Rule {
  return (tree: Tree): Observable<Tree> => {
    return of('prettier').pipe(
      concatMap((pkg: string) => getLatestNodeVersion(pkg)),
      map((packageFromRegistry: NpmRegistryPackage) => {
        const { name, version } = packageFromRegistry;

        addPackageJsonDependency(tree, { type: NodeDependencyType.Dev, name, version });

        return tree;
      })
    );
  };
}

function addPrettierFiles(prettierOptions: PrettierOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const templateSource = apply(url('./files'), [
      template({
        ...prettierOptions,
      }),
      move('./'),
    ]);

    return chain([mergeWith(templateSource)])(tree, context);
  };
}

function modifyTsLint(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tslintPath = 'tslint.json';
    if (tree.exists(tslintPath)) {
      const prettierSafeTsLint = removeConflictingTsLintRules(getFileAsJson(tree, tslintPath));

      tree.overwrite(tslintPath, JSON.stringify(prettierSafeTsLint, null, 2));
    } else {
      context.logger.info(
        `unable to locate tslint file at ${tslintPath}, conflicting styles may exists`
      );
    }

    return tree;
  };
}

function updateEditorConfig(options: PrettierOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const editorConfigPath = '.editorconfig';
    const rule = 'indent_size';

    if (tree.exists(editorConfigPath)) {
      // editorconfig exists on host
      const editorConfigBuffer = tree.read(editorConfigPath);

      if (editorConfigBuffer === null) {
        // unable to read editorconfig
        context.logger.info(
          `Could not modify .editorconfig at ${editorConfigPath}. Update ${rule} to match tabWidth: ${
            options.tabWidth
          }.`
        );
      } else {
        // editorconfig parsed, modify
        const ecBuffer = editorConfigBuffer.toString();

        if (ecBuffer.includes(rule)) {
          const modifiedEditorConfig = ecBuffer
            .split('\n')
            .map((line) => {
              if (line.includes(rule)) {
                return `indent_size = ${options.tabWidth}`;
              } else {
                return line;
              }
            })
            .join('\n');

          tree.overwrite(editorConfigPath, modifiedEditorConfig);
        }
      }
    }
    return tree;
  };
}
