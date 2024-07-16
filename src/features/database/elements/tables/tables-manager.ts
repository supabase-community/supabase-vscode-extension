import { TreeItem } from '@/features/database/elements';
import { Table, TablesElement, TreeElement } from '@/features/database/types/index';
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
      iconPath: new vscode.ThemeIcon('lock'),
      isChildren: true
    }) as TreeElement;

    const publicTables = new TreeItem({
      label: 'Public',
      id: TablesElement.PUBLIC,
      context: this.context,
      iconPath: new vscode.ThemeIcon('unlock'),
      isChildren: true
    }) as TreeElement;

    privateTable.children = this.tables.flatMap((table) => {
      if (table.schema === 'private') {
        const item = new TreeItem({
          label: table.name,
          id: String(table.id),
          contextValue: TablesElement.PRIVATE_CHILDREN,
          context: this.context,
          iconPath: new vscode.ThemeIcon('table'),
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
          iconPath: new vscode.ThemeIcon('table'),
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
          iconPath: new vscode.ThemeIcon('symbol-field'),
          isChildren: true
        }) as TreeElement
    );
  }
}
