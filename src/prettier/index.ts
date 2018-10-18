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
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Observable, of } from 'rxjs';
import { map, concatMap, filter } from 'rxjs/operators';

import {
  PrettierOptions,
  getDefaultOptions,
  PrettierSettings,
  removeConflictingTsLintRules,
} from '../utility/prettier-util';
import { addPackageJsonDependency, NodeDependencyType } from '../utility/dependencies';
import {
  getLatestNodeVersion,
  NpmRegistryPackage,
  getFileAsJson,
  addPropertyToPackageJson,
} from '../utility/util';

export default function(options: PrettierOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const cliOptions = getDefaultOptions(context, options, new PrettierSettings());

    return chain([
      addDependencies(cliOptions),
      addPrettierFiles(cliOptions),
      installPackages(),
      modifyTsLint(),
      updateEditorConfig(cliOptions),
      addLintStagedConfig(cliOptions),
      addScripts(),
    ])(tree, context);
  };
}

const prettierCommand = 'prettier --parser typescript --write';

function addDependencies(options: PrettierOptions): Rule {
  return (tree: Tree): Observable<Tree> => {
    const lintStagedDep = ['lint-staged', 'husky'];

    return of('prettier', 'lint-staged', 'husky').pipe(
      filter((pkg) => {
        if (options.lintStaged === false) {
          // remove lint-staged deps
          return !lintStagedDep.some((p) => p === pkg);
        }
        return true;
      }),
      concatMap((pkg: string) => getLatestNodeVersion(pkg)),
      map((packageFromRegistry: NpmRegistryPackage) => {
        const { name, version } = packageFromRegistry;

        addPackageJsonDependency(tree, { type: NodeDependencyType.Dev, name, version });

        return tree;
      })
    );
  };
}

function installPackages(): Rule {
  return (tree: Tree, context: SchematicContext): Tree => {
    return context.addTask(new NodePackageInstallTask()) && tree;
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

function addLintStagedConfig(options: PrettierOptions) {
  return (tree: Tree, context: SchematicContext) => {
    if (options.lintStaged === true) {
      addPropertyToPackageJson(tree, context, 'scripts', {
        precommit: 'lint-staged',
      });

      addPropertyToPackageJson(tree, context, 'lint-staged', {
        '*.{ts,tsx}': [prettierCommand, 'git add'],
      });
    }
    return tree;
  };
}

function addScripts() {
  return (tree: Tree, context: SchematicContext) => {

    addPropertyToPackageJson(tree, context, 'scripts', {
      // run against all typescript files
      prettier: `${prettierCommand} '**/*.ts'`,
    });
    return tree;
  };
}
