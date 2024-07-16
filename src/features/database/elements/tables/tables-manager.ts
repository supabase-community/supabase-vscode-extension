import { TreeItem } from '@/features/database/elements';
import { Table, TablesElement, TreeElement } from '@/features/database/types/index.ts';
import * as vscode from 'vscode';

export class TablesManager {
  private tables: Table[];
  private context: vscode.ExtensionContext;

  constructor(tables: Table[], context: vscode.ExtensionContext) {
    this.tables = tables;
    this.context = context;
  }

  getItems(): TreeElement[] {
    const privateTable = new TreeItem({
      label: 'Private',
      id: TablesElement.PRIVATE,
      context: this.context,
      iconPath: {
        light: './src/assets/light/lock.svg',
        dark: './src/assets/dark/lock.svg'
      },
      isChildren: true
    }) as TreeElement;

    const publicTables = new TreeItem({
      label: 'Public',
      id: TablesElement.PUBLIC,
      context: this.context,
      iconPath: {
        light: './src/assets/light/unlock.svg',
        dark: './src/assets/dark/unlock.svg'
      },
      isChildren: true
    }) as TreeElement;

    privateTable.children = this.tables.flatMap((table) => {
      if (table.schema === 'private') {
        const item = new TreeItem({
          label: table.name,
          id: String(table.id),
          contextValue: TablesElement.PRIVATE_CHILDREN,
          context: this.context,
          iconPath: {
            light: './src/assets/light/table.svg',
            dark: './src/assets/dark/table.svg'
          },
          isChildren: true
        }) as TreeElement;

        if (table.columns.length > 0) {
          item.children = this.getTableColumns(table.columns);
        }
        return item;
      }
      return [];
    }) as TreeElement[];

    publicTables.children = this.tables.flatMap((table) => {
      if (table.schema === 'public') {
        const item = new TreeItem({
          label: table.name,
          id: String(table.id),
          context: this.context,
          contextValue: TablesElement.PUBLIC_CHILDREN,
          iconPath: {
            light: './src/assets/light/table.svg',
            dark: './src/assets/dark/table.svg'
          },
          isChildren: true
        }) as TreeElement;

        if (table.columns.length > 0) {
          item.children = this.getTableColumns(table.columns);
        }
        return item;
      }
      return [];
    }) as TreeElement[];

    return [privateTable, publicTables];
  }

  getTableColumns(columns: Table['columns']) {
    return columns.map(
      (column) =>
        new TreeItem({
          label: `${column.name} ${column.data_type}`,
          id: column.id,
          context: this.context,
          iconPath: {
            light: './src/assets/light/symbol-field.svg',
            dark: './src/assets/dark/symbol-field.svg'
          },
          isChildren: true
        }) as TreeElement
    );
  }
}
