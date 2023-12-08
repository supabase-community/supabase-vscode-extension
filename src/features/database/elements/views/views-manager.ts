import { TreeItem } from '@/features/database/elements';
import { TreeElement, View } from '@/features/database/types/index.ts';
import * as vscode from 'vscode';

export class ViewsManager {
  private views: View[];
  private context: vscode.ExtensionContext;

  constructor(views: View[], context: vscode.ExtensionContext) {
    this.views = views;
    this.context = context;
  }

  getItems(): TreeElement[] {
    return this.views.flatMap((view) => {
      if (view.schema === 'public') {
        const item = new TreeItem({
          label: view.name,
          id: String(view.id),
          context: this.context,
          iconPath: {
            light: './src/assets/light/table.svg',
            dark: './src/assets/dark/table.svg'
          },
          isChildren: true
        }) as TreeElement;

        if (view.columns.length > 0) {
          item.children = this.getViewColumns(view.columns);
        }
        return item;
      }
    }) as TreeElement[];
  }

  getViewColumns(columns: View['columns']) {
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
