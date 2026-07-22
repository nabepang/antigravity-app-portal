import { useState, useMemo } from 'react';
import { useAppStorage } from './hooks/useAppStorage';
import type { FilterCategory, AppItem, AppFormData } from './types/app';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { SearchBar } from './components/SearchBar';
import { AppCard } from './components/AppCard';
import { AppModal } from './components/AppModal';
import { StatsSummary } from './components/StatsSummary';
import type { ToastMessage } from './components/Toast';
import { ToastContainer } from './components/Toast';
import { Plus, SearchX, AlertTriangle, Sparkles } from 'lucide-react';

export function App() {
  const {
    apps,
    addApp,
    updateApp,
    deleteApp,
    resetToSampleData,
    exportAppsJSON,
    importAppsJSON,
  } = useAppStorage();

  // 状態管理
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('すべて');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);

  // 削除確認モーダルの状態
  const [deletingTarget, setDeletingTarget] = useState<{ id: string; name: string } | null>(null);

  // トースト通知の状態
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 各カテゴリ別カウントの算出
  const categoryCounts = useMemo(() => {
    const counts: Record<FilterCategory, number> = {
      'すべて': apps.length,
      '自分用': 0,
      'はぁもにぃ永平寺用': 0,
      '他社向け用': 0,
    };
    apps.forEach(app => {
      if (counts[app.category] !== undefined) {
        counts[app.category]++;
      }
    });
    return counts;
  }, [apps]);

  // 重複を除いたモデル数 (未使用を除く)
  const uniqueModelsCount = useMemo(() => {
    const activeModels = apps
      .map(a => a.model)
      .filter(m => m && m !== '未使用' && m !== 'なし');
    return new Set(activeModels).size;
  }, [apps]);

  // カテゴリ & 検索キーワードでの絞り込み
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      // カテゴリマッチ
      const matchesCategory =
        selectedCategory === 'すべて' || app.category === selectedCategory;

      // 検索クエリマッチ
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesQuery =
        app.name.toLowerCase().includes(q) ||
        app.model.toLowerCase().includes(q) ||
        app.apiKeyName.toLowerCase().includes(q) ||
        (app.projectName && app.projectName.toLowerCase().includes(q)) ||
        (app.memo && app.memo.toLowerCase().includes(q)) ||
        (app.folderPath && app.folderPath.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [apps, selectedCategory, searchQuery]);

  // モーダル操作ハンドラー
  const handleOpenCreateModal = () => {
    setEditingApp(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (app: AppItem) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData: AppFormData) => {
    if (editingApp) {
      updateApp(editingApp.id, formData);
      addToast('success', '更新完了', `「${formData.name}」の情報を保存しました。`);
    } else {
      addApp(formData);
      addToast('success', '登録完了', `「${formData.name}」を新規登録しました。`);
    }
  };

  // 削除処理
  const handleRequestDelete = (id: string, name: string) => {
    setDeletingTarget({ id, name });
  };

  const handleConfirmDelete = () => {
    if (deletingTarget) {
      deleteApp(deletingTarget.id);
      addToast('info', '削除完了', `「${deletingTarget.name}」を削除しました。`);
      setDeletingTarget(null);
    }
  };

  // JSONインポート実行ハンドラー
  const handleImportJSON = (jsonStr: string) => {
    const result = importAppsJSON(jsonStr);
    if (result.success) {
      addToast('success', 'JSON復元成功', result.message);
    } else {
      addToast('error', 'インポートエラー', result.message);
    }
  };

  // リセット処理
  const handleResetData = () => {
    if (window.confirm('登録データをサンプルデータ（各カテゴリ1件）にリセットしますか？')) {
      resetToSampleData();
      addToast('info', 'データ初期化', 'サンプルデータにリセットしました。');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* ヘッダーコンポーネント */}
      <Header
        onOpenCreateModal={handleOpenCreateModal}
        onExportJSON={exportAppsJSON}
        onImportJSON={handleImportJSON}
        onResetData={handleResetData}
      />

      {/* メインコンテンツエリア */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ダッシュボード統計サマリー */}
        <StatsSummary
          categoryCounts={categoryCounts}
          totalModelsCount={uniqueModelsCount}
        />

        {/* コントロールバー: カテゴリフィルタ & 検索バー */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* 検索結果・件数案内 */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="text-xs text-slate-400">
            全 <span className="font-semibold text-white">{filteredApps.length}</span> 件のアプリを表示中
            {searchQuery && (
              <span>（キーワード: <strong className="text-indigo-400">"{searchQuery}"</strong>）</span>
            )}
          </div>
        </div>

        {/* カード一覧グリッド */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredApps.map(app => (
              <AppCard
                key={app.id}
                app={app}
                onEdit={handleOpenEditModal}
                onDelete={handleRequestDelete}
                onCopySuccess={msg => addToast('success', 'コピー完了', msg)}
              />
            ))}
          </div>
        ) : (
          /* データ件数0件時の状態表示 */
          <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl bg-slate-900/30 border border-dashed border-slate-800 text-center">
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-500 mb-4 border border-slate-800">
              <SearchX className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">
              {searchQuery ? '該当するアプリが見つかりませんでした' : '表示できるアプリがありません'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {searchQuery
                ? '検索キーワードを変更するか、フィルタ条件をリセットしてお試しください。'
                : '「＋ 新規アプリ登録」ボタンからAntigravityプロジェクトを追加しましょう。'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenCreateModal}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>新しいアプリを登録する</span>
              </button>
            )}
          </div>
        )}

      </main>

      {/* フッター */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Antigravity App Management Portal. Built for High-Efficiency Workflows.</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-600">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Vercel Deploy Ready & LocalStorage Protected</span>
          </div>
        </div>
      </footer>

      {/* 登録・編集モーダル */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingApp={editingApp}
      />

      {/* 削除確認ダイアログ */}
      {deletingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">アプリ情報の削除確認</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              「<strong className="text-white">{deletingTarget.name}</strong>」を一覧から削除してもよろしいですか？この操作は取り消せません。
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* トースト通知コンテナ */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
