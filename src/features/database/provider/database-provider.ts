import { SupabaseApi } from '@/features/database/classes/supabase-api';
import { TreeItem, cli, database, queries } from '@/features/database/elements';
import { BucketsManager } from '@/features/database/elements/buckets/buckets-manager';
import { DatabaseFunctionManager } from '@/features/database/elements/database-functions/db-functions-manager';
import { MigrationsManager } from '@/features/database/elements/migrations/migrations-manager';
import { TablesManager } from '@/features/database/elements/tables/tables-manager';
import { ViewsManager } from '@/features/database/elements/views/views-manager';
import { DatabaseElement, TreeElement } from '@/features/database/types/index';
import * as vscode from 'vscode';
import { isEmpty } from 'lodash';

export class DatabaseProvider implements vscode.TreeDataProvider<TreeElement> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeElement | undefined> = new vscode.EventEmitter<
    TreeElement | undefined
  >();
  private context: vscode.ExtensionContext;
  readonly onDidChangeTreeData: vscode.Event<TreeElement | undefined> = this._onDidChangeTreeData.event;
  private data: TreeElement[];

  constructor(context: vscode.ExtensionContext, private readonly supabaseApi: SupabaseApi) {
    this.context = context;
    this.data = [database]; // TODO: Add `queries` and `cli` to the tree.
  }
  getChildren(element?: TreeElement | undefined): vscode.ProviderResult<TreeElement[]> {
    if (element === undefined) {
      return this.data;
    }

    return element.children;
  }
  async getTreeItem(element: TreeElement): Promise<vscode.TreeItem> {
    await this.getTreeItemChildren(element);

    this.updateCollapsibleState(element);

    return new TreeItem({
      ...element,
      context: this.context,
      collapsibleState: element.collapsibleState
    });
  }

  updateCollapsibleState(element: TreeElement): void {
    if (element.children && element.children.length > 0) {
      element.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    } else {
      element.collapsibleState = vscode.TreeItemCollapsibleState.None;
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  async getTreeItemChildren(element: TreeElement) {
    let data;
    switch (element.id) {
      case DatabaseElement.TABLES:
        data = await this.supabaseApi.getTables();
        if (!isEmpty(data)) {
          const tables = new TablesManager(data, this.context);
          element.children = tables.getItems();
        }
        break;
      case DatabaseElement.VIEWS:
        data = await this.supabaseApi.getViews();
        if (!isEmpty(data)) {
          const views = new ViewsManager(data, this.context);
          element.children = views.getItems();
        }
        break;
      case DatabaseElement.MIGRATIONS:
        data = await this.supabaseApi.getMigrations();
        if (!isEmpty(data)) {
          const migrations = new MigrationsManager(data, this.context);
          element.children = migrations.getItems();
        }
        break;
      case DatabaseElement.DB_FUNCTIONS:
        data = await this.supabaseApi.getDatabaseFunctions();
        if (!isEmpty(data)) {
          const functions = new DatabaseFunctionManager(data, this.context);
          element.children = functions.getItems();
        }
        break;
      case DatabaseElement.BUCKETS:
        data = await this.supabaseApi.getBuckets();
        if (!isEmpty(data)) {
          const buckets = new BucketsManager(data, this.context);
          const items = buckets.getItems();
          const payload = await Promise.all(
            items.map(async (item) => ({
              data: await this.supabaseApi.getBucketList(item.label || ''),
              id: item.label
            }))
          );

          if (!isEmpty(items)) {
            if (!isEmpty(payload)) {
              items.forEach(async (item) => {
                const files = payload.find((p) => p.id === item.id);
                if (files) {
                  item.children = buckets.getChildren(await Promise.all(files.data));
                }
              });
            }
          }

          element.children = items;
        }
        break;
      default:
        break;
    }
  }
}
