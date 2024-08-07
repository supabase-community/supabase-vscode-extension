import * as vscode from 'vscode';
import { CliElements, DatabaseElement, TreeElement } from '@/features/database/types/index';

export class TreeItem extends vscode.TreeItem {
  constructor(props: {
    readonly id: string;
    readonly label?: string;
    readonly description?: string;
    readonly iconPath?:
      | string
      | vscode.Uri
      | { light: string | vscode.Uri; dark: string | vscode.Uri }
      | vscode.ThemeIcon;
    readonly contextValue?: string;
    readonly collapsibleState?: vscode.TreeItemCollapsibleState;
    readonly command?: vscode.Command;
    readonly context: vscode.ExtensionContext;
    isChildren?: boolean;
  }) {
    super(props.label || 'undefined label', props.collapsibleState);
    this.id = props.id;
    this.command = props.command;
    this.iconPath = props.iconPath;
    this.description = props.description;
    this.contextValue = props.contextValue;
  }
}

export const queries: TreeElement = {
  id: DatabaseElement.QUERIES,
  label: 'Queries (Coming soon)',
  collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
  iconPath: new vscode.ThemeIcon('search')
};

export const cli: TreeElement = {
  id: DatabaseElement.CLI,
  label: 'Commands',
  collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
  iconPath: new vscode.ThemeIcon('terminal'),
  children: [
    {
      id: CliElements.MIGRATION_NEW,
      label: 'Create new migration',
      contextValue: CliElements.MIGRATION_NEW,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: new vscode.ThemeIcon('terminal-powershell')
    },
    {
      id: CliElements.GEN_TYPES,
      label: 'Generate types',
      contextValue: CliElements.GEN_TYPES,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: new vscode.ThemeIcon('terminal-powershell')
    },
    {
      id: CliElements.DB_RESET,
      label: 'DB Reset',
      contextValue: CliElements.DB_RESET, // TODO: ask for confirmation to avoid accidental resets.
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: new vscode.ThemeIcon('terminal-powershell')
    },
    {
      id: CliElements.DB_PULL,
      label: 'DB Pull',
      contextValue: CliElements.DB_PULL,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: new vscode.ThemeIcon('terminal-powershell')
    },
    {
      id: CliElements.DB_PUSH,
      label: 'DB Push',
      contextValue: CliElements.DB_PUSH,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: new vscode.ThemeIcon('terminal-powershell')
    }
  ]
};

export const database: TreeElement = {
  id: DatabaseElement.LOCALHOST,
  label: 'Database',
  collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
  iconPath: new vscode.ThemeIcon('database'),
  children: [
    {
      id: DatabaseElement.TABLES,
      label: 'Tables',
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: new vscode.ThemeIcon('table')
    },
    {
      id: DatabaseElement.VIEWS,
      label: 'Views',
      contextValue: DatabaseElement.VIEWS,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: new vscode.ThemeIcon('eye')
    },
    {
      id: DatabaseElement.MIGRATIONS,
      label: 'Migrations History',
      contextValue: DatabaseElement.MIGRATIONS,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: new vscode.ThemeIcon('arrow-swap')
    },
    {
      id: DatabaseElement.DB_FUNCTIONS,
      label: 'DB Functions',
      contextValue: DatabaseElement.DB_FUNCTIONS,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: new vscode.ThemeIcon('variable-group')
    },
    // {
    //   id: DatabaseElement.EDGE_FUNCTIONS,
    //   label: 'Edge Functions',
    //   collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
    //   iconPath: {
    //     light: './src/assets/light/code.svg',
    //     dark: './src/assets/dark/code.svg'
    //   }
    // },
    {
      id: DatabaseElement.BUCKETS,
      label: 'Storage Buckets',
      contextValue: DatabaseElement.BUCKETS,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: new vscode.ThemeIcon('files')
    }
  ]
};
