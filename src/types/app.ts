/**
 * アプリのカテゴリ種別
 */
export type AppCategory = '自分用' | 'はぁもにぃ永平寺用' | '他社向け用';

/**
 * フィルター用カテゴリ（すべてを含む）
 */
export type FilterCategory = 'すべて' | AppCategory;

/**
 * アプリデータ構造定義
 */
export interface AppItem {
  /** 一意な識別子 (UUID) */
  id: string;
  /** アプリ名 */
  name: string;
  /** 使用 Gemini モデル (例: gemini-2.5-flash, gemini-1.5-pro) */
  model: string;
  /** APIキーの識別名称/エイリアス (※シークレット本体ではなくキー名) */
  apiKeyName: string;
  /** プロジェクト名 */
  projectName: string;
  /** Antigravity プロジェクトフォルダのローカルパス */
  folderPath: string;
  /** 利用カテゴリ */
  category: AppCategory;
  /** 利用目的・メモ・備考 */
  memo: string;
  /** WebアプリのURL (例: https://my-app.vercel.app) */
  appUrl?: string;
  /** サムネイル画像のURL (未指定の場合は appUrl から自動プレビュー生成) */
  thumbnailUrl?: string;
  /** 最終更新日時 (ISO 8601 文字列またはフォーマット済み文字列) */
  updatedAt: string;
}

/**
 * 新規作成・更新時の入力フォームデータ
 */
export type AppFormData = Omit<AppItem, 'id' | 'updatedAt'>;
