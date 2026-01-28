import { Bucket, BucketItem, DatabaseFunction, Migration, Table, View } from '@/features/database/types/index';
import to from 'await-to-js';
import axios from 'axios';
import { format } from '@scaleleap/pg-format';
import * as vscode from 'vscode';

const BASE_URL = 'http://127.0.0.1';
const PG_META_API = '/api/platform/pg-meta/default';
enum Ports {
  PG_META = 54323,
  API = 54321
}

const Endpoint = {
  TABLES: `${PG_META_API}/tables`,
  VIEWS: `${PG_META_API}/views`,
  MIGRATIONS: `${PG_META_API}/query?key=migrations`,
  DB_FUNCTIONS: `${PG_META_API}/query?key=database-functions`,
  BUCKETS: `/api/platform/storage/default/buckets`,
  QUERY: `${PG_META_API}/query`
} as const;

export class SupabaseApi {
  private baseUrl: string | undefined;
  constructor() {
    this.baseUrl = BASE_URL;
  }

  getBaseUrl(): string | undefined {
    return this.baseUrl;
  }
  async checkStatus() {
    const checkStatus = `${this.baseUrl}:${Ports.PG_META}/api/platform/projects/default`;
    const [error, data] = await to(axios.get(checkStatus));
    return { error, data };
  }

  async getSchema() {
    // TODO: allow to switch schema.
    const sql = `SELECT table_name, column_name, data_type, character_maximum_length, column_default, is_nullable
    FROM information_schema.columns
    where table_schema = 'public'`;
    const [err, res] = await to(this.executeQuery(sql));
    if (err) {
      throw err;
    }
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
    if (err) {
      throw err;
    }
    return this.schemaToDDL(res.data);
  }

  async executeQuery(query: string) {
    const endpoint = `${this.baseUrl}:${Ports.PG_META}${Endpoint.QUERY}`;

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
    const [_, res] = await to(
      axios.post(endpoint, {
        query: FUNCTIONS_SQL
      })
    );

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
    const endpoint = `${this.baseUrl}:${Ports.PG_META}${Endpoint.BUCKETS}/${item}/objects/list`;
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
        if (c.is_nullable === 'NO') {
          colSql += ' not null ';
        }
        if (c.column_default === 'NO') {
          colSql += ` default ${c.column_default} `;
        }
        colSql += ',\n';
        sql.push(colSql);
      }
      sql.push(');');
      out.push(sql.join(''));
    }
    return out.join('\n');
  }
}

export const FUNCTIONS_SQL = /* SQL */ `
-- CTE with sane arg_modes, arg_names, and arg_types.
-- All three are always of the same length.
-- All three include all args, including OUT and TABLE args.
with functions as (
  select
    *,
    -- proargmodes is null when all arg modes are IN
    coalesce(
      p.proargmodes,
      array_fill('i'::text, array[cardinality(coalesce(p.proallargtypes, p.proargtypes))])
    ) as arg_modes,
    -- proargnames is null when all args are unnamed
    coalesce(
      p.proargnames,
      array_fill(''::text, array[cardinality(coalesce(p.proallargtypes, p.proargtypes))])
    ) as arg_names,
    -- proallargtypes is null when all arg modes are IN
    coalesce(p.proallargtypes, p.proargtypes) as arg_types,
    array_cat(
      array_fill(false, array[pronargs - pronargdefaults]),
      array_fill(true, array[pronargdefaults])) as arg_has_defaults
  from
    pg_proc as p
  where
    p.prokind = 'f'
)
select
  f.oid as id,
  n.nspname as schema,
  f.proname as name,
  l.lanname as language,
  case
    when l.lanname = 'internal' then ''
    else f.prosrc
  end as definition,
  case
    when l.lanname = 'internal' then f.prosrc
    else pg_get_functiondef(f.oid)
  end as complete_statement,
  coalesce(f_args.args, '[]') as args,
  pg_get_function_arguments(f.oid) as argument_types,
  pg_get_function_identity_arguments(f.oid) as identity_argument_types,
  f.prorettype as return_type_id,
  pg_get_function_result(f.oid) as return_type,
  nullif(rt.typrelid, 0) as return_type_relation_id,
  f.proretset as is_set_returning_function,
  case
    when f.provolatile = 'i' then 'IMMUTABLE'
    when f.provolatile = 's' then 'STABLE'
    when f.provolatile = 'v' then 'VOLATILE'
  end as behavior,
  f.prosecdef as security_definer,
  f_config.config_params as config_params
from
  functions f
  left join pg_namespace n on f.pronamespace = n.oid
  left join pg_language l on f.prolang = l.oid
  left join pg_type rt on rt.oid = f.prorettype
  left join (
    select
      oid,
      jsonb_object_agg(param, value) filter (where param is not null) as config_params
    from
      (
        select
          oid,
          (string_to_array(unnest(proconfig), '='))[1] as param,
          (string_to_array(unnest(proconfig), '='))[2] as value
        from
          functions
      ) as t
    group by
      oid
  ) f_config on f_config.oid = f.oid
  left join (
    select
      oid,
      jsonb_agg(jsonb_build_object(
        'mode', t2.mode,
        'name', name,
        'type_id', type_id,
        -- Cast null into false boolean
        'has_default', COALESCE(has_default, false)
      )) as args
    from
      (
        select
          oid,
          unnest(arg_modes) as mode,
          unnest(arg_names) as name,
          -- Coming from: coalesce(p.proallargtypes, p.proargtypes) postgres won't automatically assume
          -- integer, we need to cast it to be properly parsed
          unnest(arg_types)::int8 as type_id,
          unnest(arg_has_defaults) as has_default
        from
          functions
      ) as t1,
      lateral (
        select
          case
            when t1.mode = 'i' then 'in'
            when t1.mode = 'o' then 'out'
            when t1.mode = 'b' then 'inout'
            when t1.mode = 'v' then 'variadic'
            else 'table'
          end as mode
      ) as t2
    group by
      t1.oid
  ) f_args on f_args.oid = f.oid
`;
