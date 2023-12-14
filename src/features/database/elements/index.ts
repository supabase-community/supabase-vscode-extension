import * as vscode from 'vscode';
import { CliElements, DatabaseElement, TreeElement } from '@/features/database/types/index.ts';

export class TreeItem extends vscode.TreeItem {
  constructor(props: {
    readonly id: string;
    readonly label?: string;
    readonly description?: string;
    readonly iconPath?: { light: string; dark: string } | undefined;
    readonly contextValue?: string;
    readonly collapsibleState?: vscode.TreeItemCollapsibleState;
    readonly command?: vscode.Command;
    readonly context: vscode.ExtensionContext;
    isChildren?: boolean;
  }) {
    super(props.label || 'undefined label', props.collapsibleState);
    this.id = props.id;
    this.command = props.command;
    this.iconPath = props.iconPath
      ? {
          dark: props.isChildren ? props.iconPath.dark : props.context.asAbsolutePath(props.iconPath.dark),
          light: props.context.asAbsolutePath(props.iconPath.light)
        }
      : undefined;
    this.description = props.description;
    this.contextValue = props.contextValue;
  }
}

export const queries: TreeElement = {
  id: DatabaseElement.QUERIES,
  label: 'Queries',
  collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
  iconPath: {
    light: './src/assets/light/search.svg',
    dark: './src/assets/dark/search.svg'
  }
};

export const cli: TreeElement = {
  id: DatabaseElement.CLI,
  label: 'Commands',
  collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
  iconPath: {
    light: './src/assets/light/terminal.svg',
    dark: './src/assets/dark/terminal.svg'
  },
  children: [
    {
      id: CliElements.GEN_TYPES,
      label: 'Generate types',
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: {
        light: './src/assets/light/terminal-2.svg',
        dark: './src/assets/dark/terminal-2.svg'
      }
    },
    {
      id: CliElements.DB_RESET,
      label: 'DB Reset',
      contextValue: CliElements.DB_RESET,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: {
        light: './src/assets/light/terminal-2.svg',
        dark: './src/assets/dark/terminal-2.svg'
      }
    },
    {
      id: CliElements.DB_PULL,
      label: 'DB Pull',
      contextValue: CliElements.DB_PULL,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: {
        light: './src/assets/light/terminal-2.svg',
        dark: './src/assets/dark/terminal-2.svg'
      }
    },
    {
      id: CliElements.DB_PUSH,
      label: 'DB Push',
      contextValue: CliElements.DB_PUSH,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: {
        light: './src/assets/light/terminal-2.svg',
        dark: './src/assets/dark/terminal-2.svg'
      }
    }
  ]
};

export const database: TreeElement = {
  id: DatabaseElement.LOCALHOST,
  label: '127.0.0.1',
  collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
  iconPath: {
    light: './src/assets/light/database.svg',
    dark: './src/assets/dark/database.svg'
  },
  children: [
    {
      id: DatabaseElement.TABLES,
      label: 'Tables',
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: {
        light: './src/assets/light/table.svg',
        dark: './src/assets/dark/table.svg'
      }
    },
    {
      id: DatabaseElement.VIEWS,
      label: 'Views',
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: {
        light: './src/assets/light/eye.svg',
        dark: './src/assets/dark/eye.svg'
      }
    },
    {
      id: DatabaseElement.MIGRATIONS,
      label: 'Remote migrations',
      contextValue: DatabaseElement.MIGRATIONS,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: {
        light: './src/assets/light/arrow-swap.svg',
        dark: './src/assets/dark/arrow-swap.svg'
      }
    },
    {
      id: DatabaseElement.DB_FUNCTIONS,
      label: 'DB Functions',
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: {
        light: './src/assets/light/variable-group.svg',
        dark: './src/assets/dark/variable-group.svg'
      }
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
      label: 'Buckets',
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      iconPath: {
        light: './src/assets/light/files.svg',
        dark: './src/assets/dark/files.svg'
      }
    }
  ]
};
