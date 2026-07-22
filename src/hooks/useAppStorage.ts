import { useState, useEffect } from 'react';
import type { AppItem, AppFormData } from '../types/app';

const STORAGE_KEY = 'antigravity_apps_data_v1';

/**
 * 自動サムネイル取得用ヘルパー
 */
export function getAppThumbnail(appUrl?: string, thumbnailUrl?: string): string | null {
  if (thumbnailUrl && thumbnailUrl.trim()) {
    return thumbnailUrl.trim();
  }
  if (appUrl && appUrl.trim() && (appUrl.startsWith('http://') || appUrl.startsWith('https://'))) {
    // WordPress mshots または thum.io によるスクリーンショットプレビュー生成サービス
    return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(appUrl.trim())}?w=800`;
  }
  return null;
}

/**
 * 初期サンプルデータ（各カテゴリ1件ずつ）
 */
const SAMPLE_APPS: AppItem[] = [
  {
    id: 'sample-001',
    name: 'アプリ管理ポータルサイト',
    model: 'Gemini 3.6 Flash',
    apiKeyName: 'GEMINI_API_KEY_PERSONAL',
    projectName: 'アプリ管理ポータルサイト',
    folderPath: 'c:/Users/nabep/ドキュメント/05.やる気のスイッチ！エキスパートコーチ養成講座/★平鍋開催講座/7.AI副業/06.Antigravity/アプリ管理ポータルサイト',
    category: '自分用',
    memo: 'Google Antigravityで開発した各プロジェクトを一括管理・検索・閲覧・編集するためのダッシュボード。',
    appUrl: 'https://antigravity-portal.vercel.app',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-002',
    name: 'はぁもにぃ永平寺 業務自動化アシスタント',
    model: 'Gemini 3.1 Pro',
    apiKeyName: 'GEMINI_API_KEY_HARMONY',
    projectName: '永平寺業務自動化',
    folderPath: 'C:/Projects/HarmonyEiheiji/WorkflowApp',
    category: 'はぁもにぃ永平寺用',
    memo: '施設予約・問い合わせ受入およびkintoneデータ連携をサポートする業務効率化AIツール。',
    appUrl: 'https://harmony-eiheiji.example.com',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-003',
    name: 'AI DXコンサル顧客向け提案デモアプリ',
    model: 'Gemini 3.5 Flash',
    apiKeyName: 'GEMINI_API_KEY_CLIENT',
    projectName: 'DX提案用デモ',
    folderPath: 'C:/Projects/ClientDemo/DXPortal',
    category: '他社向け用',
    memo: '他社クライアント向けにAI副業・自動化ソリューションをデモ実演するためのポータル画面。',
    appUrl: 'https://dx-demo.example.com',
    updatedAt: new Date().toISOString(),
  },
];

export function useAppStorage() {
  const [apps, setApps] = useState<AppItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('LocalStorageの読み込みに失敗しました:', e);
    }
    return SAMPLE_APPS;
  });

  // データが更新されるたびに LocalStorage に自動保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch (e) {
      console.error('LocalStorageへの保存に失敗しました:', e);
    }
  }, [apps]);

  /** アプリ新規登録 */
  const addApp = (data: AppFormData): AppItem => {
    const newApp: AppItem = {
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : `app-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      updatedAt: new Date().toISOString(),
    };
    setApps(prev => [newApp, ...prev]);
    return newApp;
  };

  /** アプリ更新 */
  const updateApp = (id: string, data: AppFormData): AppItem | null => {
    let updatedItem: AppItem | null = null;
    setApps(prev =>
      prev.map(app => {
        if (app.id === id) {
          updatedItem = {
            ...data,
            id,
            updatedAt: new Date().toISOString(),
          };
          return updatedItem;
        }
        return app;
      })
    );
    return updatedItem;
  };

  /** アプリ削除 */
  const deleteApp = (id: string) => {
    setApps(prev => prev.filter(app => app.id !== id));
  };

  /** データ初期リセット */
  const resetToSampleData = () => {
    setApps(SAMPLE_APPS);
  };

  /** JSONファイルとしてバックアップ（エクスポート） */
  const exportAppsJSON = () => {
    const dataStr = JSON.stringify(apps, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = url;
    link.download = `antigravity_apps_backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * JSONファイルからのリストア（インポート）
   */
  const importAppsJSON = (jsonString: string): { success: boolean; message: string; count?: number } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, message: 'JSONのルート構造が配列ではありません。' };
      }

      // 必須フィールドのフォーマットチェック
      const isValid = parsed.every(
        (item: any) =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.name === 'string' &&
          typeof item.category === 'string' &&
          ['自分用', 'はぁもにぃ永平寺用', '他社向け用'].includes(item.category)
      );

      if (!isValid) {
        return { success: false, message: 'JSONのデータ構造が不正です。必須フィールド（name, category等）を確認してください。' };
      }

      // IDやupdatedAt, appUrl, thumbnailUrl のフォールバック付与
      const sanitizedApps: AppItem[] = parsed.map((item: any, idx: number) => ({
        id: item.id || `imported-${Date.now()}-${idx}`,
        name: item.name || '名称未設定',
        model: item.model || 'Gemini 3.5 Flash',
        apiKeyName: item.apiKeyName || '未割り当て',
        projectName: item.projectName || item.name || '',
        folderPath: item.folderPath || '',
        category: ['自分用', 'はぁもにぃ永平寺用', '他社向け用'].includes(item.category) ? item.category : '自分用',
        memo: item.memo || '',
        appUrl: item.appUrl || undefined,
        thumbnailUrl: item.thumbnailUrl || undefined,
        updatedAt: item.updatedAt || new Date().toISOString(),
      }));

      setApps(sanitizedApps);
      return { success: true, message: `${sanitizedApps.length} 件のアプリデータを正常に読み込みました。`, count: sanitizedApps.length };
    } catch (e) {
      return { success: false, message: 'JSONファイルの解析に失敗しました。正しいJSON形式ファイルを選択してください。' };
    }
  };

  return {
    apps,
    addApp,
    updateApp,
    deleteApp,
    resetToSampleData,
    exportAppsJSON,
    importAppsJSON,
  };
}
