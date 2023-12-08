import { TreeItem } from '@/features/database/elements';
import { Migration, TreeElement, View } from '@/features/database/types/index.ts';
import * as vscode from 'vscode';

export class MigrationsManager {
  private migrations: Migration[];
  private context: vscode.ExtensionContext;

  constructor(migrations: Migration[], context: vscode.ExtensionContext) {
    this.migrations = migrations;
    this.context = context;
  }

  getItems(): TreeElement[] {
    return this.migrations.flatMap((migration) => {
      const item = new TreeItem({
        label: `${migration.version}_${migration.name}`,
        id: migration.version,
        context: this.context,
        iconPath: {
          light: './src/assets/light/file-code.svg',
          dark: './src/assets/dark/file-code.svg'
        },
        isChildren: true
      }) as TreeElement;
      return item;
    }) as TreeElement[];
  }
}
