import { TreeItem } from '@/features/database/elements';
import { DatabaseFunction, Migration, TreeElement, View } from '@/features/database/types/index.ts';
import * as vscode from 'vscode';

export class DatabaseFunctionManager {
  private functions: DatabaseFunction[];
  private context: vscode.ExtensionContext;

  constructor(functions: DatabaseFunction[], context: vscode.ExtensionContext) {
    this.functions = functions;
    this.context = context;
  }

  getItems(): TreeElement[] {
    return this.functions.flatMap((func) => {
      const item = new TreeItem({
        label: func.name,
        id: String(func.id),
        context: this.context,
        iconPath: {
          light: './src/assets/light/cube.svg',
          dark: './src/assets/dark/cube.svg'
        },
        isChildren: true
      }) as TreeElement;
      return item;
    }) as TreeElement[];
  }
}
