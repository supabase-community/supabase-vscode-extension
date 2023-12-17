import { Bucket, BucketItem, DatabaseFunction, Migration, Table, View } from '@/features/database/types/index.ts';
import { WorkspaceStorage, WorkspaceStorageKeys } from '@/utils/workspace-storage';
import to from 'await-to-js';
import axios from 'axios';
import * as vscode from 'vscode';

enum Endpoint {
  TABLES = '/api/pg-meta/default/tables',
  VIEWS = '/api/pg-meta/default/views',
  MIGRATIONS = '/api/pg-meta/default/query?key=migrations',
  DB_FUNCTIONS = '/api/pg-meta/default/functions',
  BUCKETS = '/api/storage/default/buckets'
}

export class SupabaseApi {
  private baseUrl: string | undefined;
  constructor(private readonly workspaceStorage: WorkspaceStorage) {
    this.baseUrl = this.workspaceStorage.get(WorkspaceStorageKeys.BASE_URL);
  }

  getBaseUrl(): string | undefined {
    return this.baseUrl;
  }

  async getTables(): Promise<Table[]> {
    const endpoint = this.baseUrl + Endpoint.TABLES;
    const [_, res] = await to(axios.get(endpoint));

    if (res && res.data) {
      const tables = (res.data as Table[]).filter((table) => table.schema === 'public' || table.schema === 'private');
      return tables;
    }

    return [];
  }

  async executeQuery(query: string) {
    const endpoint = this.baseUrl + '/api/pg-meta/default/query';

    return axios.post(endpoint, { query });
  }

  async getViews(): Promise<View[]> {
    const endpoint = this.baseUrl + Endpoint.VIEWS;
    const [_, res] = await to(axios.get(endpoint));
    if (res && res.data) {
      const views = (res.data as View[]).filter((table) => table.schema === 'public');
      return views;
    }
    return [];
  }

  async getMigrations(): Promise<Migration[]> {
    const endpoint = this.baseUrl + Endpoint.MIGRATIONS;
    const [_, res] = await to(
      axios.post(endpoint, {
        query: 'select\n *\n from supabase_migrations.schema_migrations sm\n order by sm.version asc'
      })
    );

    if (res && res.data) {
      return res.data;
    }
    return [];
  }

  async getDatabaseFunctions(): Promise<DatabaseFunction[]> {
    const endpoint = this.baseUrl + Endpoint.DB_FUNCTIONS;
    const [err, res] = await to(axios.get(endpoint));

    if (err) {
      vscode.window.showErrorMessage(err.message);
    }

    if (res && res.data) {
      const functions = (res.data as DatabaseFunction[]).filter((table) => table.schema === 'public');
      return functions;
    }
    return [];
  }

  async getBuckets(): Promise<Bucket[]> {
    const endpoint = this.baseUrl + Endpoint.BUCKETS;
    const [err, res] = await to(axios.get(endpoint));

    if (err) {
      vscode.window.showErrorMessage(err.message);
    }

    if (res && res.data) {
      return res.data as Bucket[];
    }
    return [];
  }

  async getBucketList(item: string): Promise<BucketItem[]> {
    const endpoint = `${this.baseUrl}${Endpoint.BUCKETS}/${item}/objects/list`;
    const [err, res] = await to(axios.post(endpoint));

    if (err) {
      vscode.window.showErrorMessage(err.message);
    }

    if (res && res.data) {
      return res.data as BucketItem[];
    }
    return [];
  }
}
