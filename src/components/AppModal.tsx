import React, { useState, useEffect } from 'react';
import type { AppItem, AppFormData, AppCategory } from '../types/app';
import { X, ShieldAlert, Cpu, Folder, Key, Layout, FileText, CheckCircle, Globe, Image } from 'lucide-react';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppFormData) => void;
  editingApp?: AppItem | null;
}

const PRESET_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.0-pro',
];

const CATEGORIES: AppCategory[] = ['自分用', 'はぁもにぃ永平寺用', '他社向け用'];

export const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingApp,
}) => {
  const [formData, setFormData] = useState<AppFormData>({
    name: '',
    model: 'gemini-2.5-flash',
    apiKeyName: 'GEMINI_API_KEY_DEFAULT',
    projectName: '',
    folderPath: '',
    category: '自分用',
    memo: '',
    appUrl: '',
    thumbnailUrl: '',
  });

  const [isCustomModel, setIsCustomModel] = useState(false);
  const [customModelValue, setCustomModelValue] = useState('');
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (editingApp) {
      setFormData({
        name: editingApp.name,
        model: editingApp.model,
        apiKeyName: editingApp.apiKeyName,
        projectName: editingApp.projectName,
        folderPath: editingApp.folderPath,
        category: editingApp.category,
        memo: editingApp.memo,
        appUrl: editingApp.appUrl || '',
        thumbnailUrl: editingApp.thumbnailUrl || '',
      });

      if (!PRESET_MODELS.includes(editingApp.model)) {
        setIsCustomModel(true);
        setCustomModelValue(editingApp.model);
      } else {
        setIsCustomModel(false);
        setCustomModelValue('');
      }
    } else {
      setFormData({
        name: '',
        model: 'gemini-2.5-flash',
        apiKeyName: 'GEMINI_API_KEY_MAIN',
        projectName: '',
        folderPath: '',
        category: '自分用',
        memo: '',
        appUrl: '',
        thumbnailUrl: '',
      });
      setIsCustomModel(false);
      setCustomModelValue('');
    }
    setErrors({});
  }, [editingApp, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'アプリ名は必須です';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalModel = isCustomModel ? customModelValue.trim() || 'gemini-2.5-flash' : formData.model;

    onSubmit({
      ...formData,
      model: finalModel,
      appUrl: formData.appUrl?.trim() || undefined,
      thumbnailUrl: formData.thumbnailUrl?.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* モーダルヘッダー */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white">
              {editingApp ? 'アプリ情報の編集' : '新規アプリ登録'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Antigravity プロジェクトのメタ情報・WebアプリURLを入力・更新します
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* フォーム本体 */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
          
          {/* カテゴリ選択 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-indigo-400" />
              <span>カテゴリ <span className="text-rose-400">*</span></span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    formData.category === cat
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* アプリ名 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              アプリ名 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="例: ポータルサイトダッシュボード"
              className={`w-full px-3.5 py-2 bg-slate-950/80 border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.name
                  ? 'border-rose-500/80 focus:ring-rose-500'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* WebアプリのURL (新規追加) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>WebアプリのURL (デプロイ先URL)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">登録するとプレビューが自動生成されます</span>
            </label>
            <input
              type="url"
              value={formData.appUrl || ''}
              onChange={e => setFormData({ ...formData, appUrl: e.target.value })}
              placeholder="https://my-app.vercel.app"
              className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-mono"
            />
          </div>

          {/* サムネイル画像URL (任意) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Image className="w-4 h-4 text-purple-400" />
                <span>カスタム サムネイル画像URL (任意)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">空欄時はWebアプリURLから自動生成</span>
            </label>
            <input
              type="url"
              value={formData.thumbnailUrl || ''}
              onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              placeholder="https://example.com/thumbnail.png (空欄推奨)"
              className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-mono"
            />
          </div>

          {/* プロジェクト名 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              プロジェクト名 (フォルダ名 / リポジトリ名)
            </label>
            <input
              type="text"
              value={formData.projectName}
              onChange={e => setFormData({ ...formData, projectName: e.target.value })}
              placeholder="例: アプリ管理ポータルサイト"
              className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Geminiモデル選択 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>使用 Gemini モデル</span>
            </label>
            
            <div className="space-y-2">
              <select
                value={isCustomModel ? 'custom' : formData.model}
                onChange={e => {
                  if (e.target.value === 'custom') {
                    setIsCustomModel(true);
                  } else {
                    setIsCustomModel(false);
                    setFormData({ ...formData, model: e.target.value });
                  }
                }}
                className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {PRESET_MODELS.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
                <option value="custom">✏️ カスタムモデル名を自由入力...</option>
              </select>

              {isCustomModel && (
                <input
                  type="text"
                  value={customModelValue}
                  onChange={e => setCustomModelValue(e.target.value)}
                  placeholder="例: gemini-3.0-ultra-preview"
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-indigo-500/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 animate-in fade-in"
                />
              )}
            </div>
          </div>

          {/* APIキー名 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>登録 API キーの名称 / エイリアス</span>
            </label>
            <input
              type="text"
              value={formData.apiKeyName}
              onChange={e => setFormData({ ...formData, apiKeyName: e.target.value })}
              placeholder="例: GEMINI_API_KEY_PERSONAL"
              className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
            />
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-amber-400/90 bg-amber-950/30 p-2 rounded-lg border border-amber-500/20">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>APIキー本体は入力せず、識別用の名称（例: Dev-Key-01）を入力してください。</span>
            </div>
          </div>

          {/* フォルダパス */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-slate-400" />
              <span>Antigravity プロジェクトフォルダのパス</span>
            </label>
            <input
              type="text"
              value={formData.folderPath}
              onChange={e => setFormData({ ...formData, folderPath: e.target.value })}
              placeholder="例: C:/Users/nabep/ドキュメント/AI副業/06.Antigravity/MyApp"
              className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
            />
          </div>

          {/* メモ */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>利用目的・メモ・備考</span>
            </label>
            <textarea
              rows={3}
              value={formData.memo}
              onChange={e => setFormData({ ...formData, memo: e.target.value })}
              placeholder="アプリの用途、連携サービス、開発時のメモなどを記入..."
              className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none text-xs leading-relaxed"
            />
          </div>

          {/* フッターアクションボタン */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{editingApp ? '変更内容を保存' : '登録を完了'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
