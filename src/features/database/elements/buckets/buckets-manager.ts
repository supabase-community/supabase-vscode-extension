import { SupabaseApi } from '@/features/database/classes/supabase-api';
import { TreeItem } from '@/features/database/elements';
import { Bucket, BucketItem, DatabaseFunction, Migration, TreeElement, View } from '@/features/database/types/index.ts';
import * as vscode from 'vscode';

export class BucketsManager {
  private buckets: Bucket[];
  private context: vscode.ExtensionContext;

  constructor(buckets: Bucket[], context: vscode.ExtensionContext) {
    this.buckets = buckets;
    this.context = context;
  }

  getItems() {
    return this.buckets.flatMap((bucket) => {
      const item = new TreeItem({
        label: bucket.name,
        id: bucket.id,
        context: this.context,
        iconPath: {
          light: './src/assets/light/folder.svg',
          dark: './src/assets/dark/folder.svg'
        },
        isChildren: true
      }) as TreeElement;

      return item;
    });
  }

  getChildren(items: BucketItem[]) {
    return items.flatMap((item) => {
      return new TreeItem({
        label: item.name,
        id: item.id,
        context: this.context,
        iconPath: {
          light: './src/assets/light/file-media.svg',
          dark: './src/assets/dark/file-media.svg'
        },
        isChildren: true
      }) as TreeElement;
    });
  }
}
