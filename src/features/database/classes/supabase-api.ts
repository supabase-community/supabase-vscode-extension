import { Bucket, BucketItem, DatabaseFunction, Migration, Table, View } from '@/features/database/types/index';
import { WorkspaceStorage, WorkspaceStorageKeys } from '@/utils/workspace-storage';
import to from 'await-to-js';
import axios from 'axios';
import { format } from '@scaleleap/pg-format';
import * as vscode from 'vscode';

enum Ports {
  PG_META = 54323,
  API = 54321
}

enum Endpoint {
  TABLES = '/api/pg-meta/default/tables',
  VIEWS = '/api/pg-meta/default/views',
  MIGRATIONS = '/api/pg-meta/default/query?key=migrations',
  DB_FUNCTIONS = '/api/pg-meta/default/functions',
  BUCKETS = '/api/storage/default/buckets'
}

const BASE_URL = 'http://127.0.0.1';

export class SupabaseApi {
  private baseUrl: string | undefined;
  constructor() {
    this.baseUrl = BASE_URL;
  }

  getBaseUrl(): string | undefined {
    return this.baseUrl;
  }

  async checkStatus() {
    const checkStatus = `${this.baseUrl}:${Ports.PG_META}/api/projects/default`;
    const [error, data] = await to(axios.get(checkStatus));
    return { error, data };
  }

  async getSchema() {
    // TODO: allow to switch schema.
    const sql = `SELECT table_name, column_name, data_type, character_maximum_length, column_default, is_nullable
    FROM information_schema.columns
    where table_schema = 'public'`;
    const [err, res] = await to(this.executeQuery(sql));
    if (err) throw err;
    return this.schemaToDDL(res.data);
  }

  async getTables(): Promise<Table[]> {
    const endpoint = `${this.baseUrl}:${Ports.PG_META}` + Endpoint.TABLES;
    const [_, res] = await to(axios.get(endpoint));

    if (res && res.data) {
      const tables = (res.data as Table[]).filter((table) => table.schema === 'public' || table.schema === 'private');
      return tables;
    }

    return [];
  }

  async getTable(name: string) {
    const sql = format(
      `SELECT table_name, column_name, data_type, character_maximum_length, column_default, is_nullable FROM information_schema.columns where table_schema = 'public' and table_name= %L`,
      name
    );
    const [err, res] = await to(this.executeQuery(sql));
    console.log({ sql, err, res });
    if (err) throw err;
    return this.schemaToDDL(res.data);
  }

  async executeQuery(query: string) {
    const endpoint = `${this.baseUrl}:${Ports.PG_META}` + '/api/pg-meta/default/query';

    return axios.post(endpoint, { query });
  }

  async getViews(): Promise<View[]> {
    const endpoint = `${this.baseUrl}:${Ports.PG_META}` + Endpoint.VIEWS;
    const [_, res] = await to(axios.get(endpoint));
    if (res && res.data) {
      const views = (res.data as View[]).filter((table) => table.schema === 'public');
      return views;
    }
    return [];
  }

  async getMigrations(): Promise<Migration[]> {
    const endpoint = `${this.baseUrl}:${Ports.PG_META}` + Endpoint.MIGRATIONS;
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
    const endpoint = `${this.baseUrl}:${Ports.PG_META}` + Endpoint.DB_FUNCTIONS;
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
    const endpoint = `${this.baseUrl}:${Ports.PG_META}` + Endpoint.BUCKETS;
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

  schemaToDDL(schema: { ['table_name']: string; [key: string]: any }[]) {
    const tables: { [key: string]: any } = {};
    for (let row of schema) {
      tables[row.table_name] = row;
    }
    const out = [];
    const tableNames = Object.keys(tables);
    for (let table of tableNames) {
      const sql = [`create table ${table}(\n`];
      const cols = schema.filter((s) => s.table_name === table);
      for (let c of cols) {
        let colSql = '';
        //if (c.column_name === null || c.column_name === "") continue;
        colSql = `  ${c.column_name} ${c.data_type}`;
        if (c.is_nullable === 'NO') colSql += ' not null ';
        if (c.column_default === 'NO') colSql += ` default ${c.column_default} `;
        colSql += ',\n';
        sql.push(colSql);
      }
      sql.push(');');
      out.push(sql.join(''));
    }
    return out.join('\n');
  }
}
