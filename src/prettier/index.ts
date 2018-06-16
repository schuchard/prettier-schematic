import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export default function(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    tree.create(options.name || 'hello', 'world');
    return tree;
  };
}
