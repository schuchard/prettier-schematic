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

import { PrettierOptions, getDefaultOptions, PrettierSettings } from '../utility/prettier-util';
import { addPackageJsonDependency, NodeDependencyType } from '../utility/dependencies';
import { getLatestNodeVersion, NpmRegistryPackage } from '../utility/util';

export default function(options: PrettierOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const cliOptions = getDefaultOptions(context, options, new PrettierSettings());

    return chain([addDependencies(), addPrettierConfig(cliOptions)])(tree, context);
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

function addPrettierConfig(prettierOptions: PrettierOptions): Rule {
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
