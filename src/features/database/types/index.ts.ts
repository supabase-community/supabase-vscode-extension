import * as vscode from 'vscode';

export type TreeElement = {
  id: string;
  parentId?: string;
  label?: string;
  description?: string;
  contextValue?: string;
  command?: vscode.Command;
  collapsibleState?: vscode.TreeItemCollapsibleState;
  children?: TreeElement[];
  iconPath?: { light: string; dark: string };
} & vscode.TreeItem;

export enum DatabaseElement {
  CLI = 'database.cli',
  QUERIES = 'database.queries',
  LOCALHOST = 'database.localhost',
  TABLES = 'database.tables',
  MIGRATIONS = 'database.migrations',
  VIEWS = 'database.views',
  DB_FUNCTIONS = 'database.db_functions',
  EDGE_FUNCTIONS = 'database.edge_functions',
  BUCKETS = 'database.buckets'
}

export enum TablesElement {
  PUBLIC = 'database.tables.public',
  PRIVATE = 'database.tables.private'
}

//#region Tables
export interface Table {
  id: number;
  schema: string;
  name: string;
  rls_enabled: boolean;
  rls_forced: boolean;
  replica_identity: string;
  bytes: number;
  size: string;
  live_rows_estimate: number;
  dead_rows_estimate: number;
  comment?: string;
  columns: Column[];
  primary_keys: PrimaryKey[];
  relationships: Relationship[];
}

export interface Column {
  table_id: number;
  schema: string;
  table: string;
  id: string;
  ordinal_position: number;
  name: string;
  default_value?: string;
  data_type: string;
  format: string;
  is_identity: boolean;
  identity_generation: any;
  is_generated: boolean;
  is_nullable: boolean;
  is_updatable: boolean;
  is_unique: boolean;
  enums: string[];
  check?: string;
  comment?: string;
}

export interface PrimaryKey {
  schema: string;
  table_name: string;
  name: string;
  table_id: number;
}

export interface Relationship {
  id: number;
  constraint_name: string;
  source_schema: string;
  source_table_name: string;
  source_column_name: string;
  target_table_schema: string;
  target_table_name: string;
  target_column_name: string;
}
//#endregion

//#region View
export interface View {
  id: number;
  schema: string;
  name: string;
  is_updatable: boolean;
  comment: any;
  columns: Column[];
}
export interface ViewColumn {
  table_id: number;
  schema: string;
  table: string;
  id: string;
  ordinal_position: number;
  name: string;
  default_value: any;
  data_type: string;
  format: string;
  is_identity: boolean;
  identity_generation: any;
  is_generated: boolean;
  is_nullable: boolean;
  is_updatable: boolean;
  is_unique: boolean;
  enums: string[];
  check: any;
  comment: any;
}
//#endregion

//#region Migrations
export interface Migration {
  version: string;
  statements: string[];
  name: string;
}

//#endregion

//#region DB Functions
export interface DatabaseFunction {
  id: number;
  schema: string;
  name: string;
  language: string;
  definition: string;
  complete_statement: string;
  args: Arg[];
  argument_types: string;
  identity_argument_types: string;
  return_type_id: number;
  return_type: string;
  return_type_relation_id?: number;
  is_set_returning_function: boolean;
  behavior: string;
  security_definer: boolean;
  config_params?: ConfigParams;
}

export interface Arg {
  mode: string;
  name: string;
  type_id: number;
  has_default?: boolean;
}

export interface ConfigParams {
  search_path: string;
}

//#endregion

//#region Buckets
export interface Bucket {
  id: string;
  name: string;
  owner: string;
  public: boolean;
  file_size_limit: any;
  allowed_mime_types: any;
  created_at: string;
  updated_at: string;
}

export interface BucketItem {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Metadata;
}

export interface Metadata {
  eTag: string;
  size: number;
  mimetype: string;
  cacheControl: string;
  lastModified: string;
  contentLength: number;
  httpStatusCode: number;
}

//#endregion
