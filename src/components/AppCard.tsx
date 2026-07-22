import React, { useState } from 'react';
import type { AppItem } from '../types/app';
import { getAppThumbnail } from '../hooks/useAppStorage';
import {
  Copy,
  Check,
  Cpu,
  Key,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  FolderOpen,
  Calendar,
  Layers,
  ExternalLink,
  Globe,
  ImageOff,
} from 'lucide-react';

interface AppCardProps {
  app: AppItem;
  onEdit: (app: AppItem) => void;
  onDelete: (id: string, name: string) => void;
  onCopySuccess: (text: string) => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  onEdit,
  onDelete,
  onCopySuccess,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isMemoExpanded, setIsMemoExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // サムネイル画像URL
  const thumbnailUrl = getAppThumbnail(app.appUrl, app.thumbnailUrl);

  // フォルダパスのコピー機能
  const handleCopyPath = async () => {
    if (!app.folderPath) return;
    try {
      await navigator.clipboard.writeText(app.folderPath);
      setIsCopied(true);
      onCopySuccess('フォルダパスをクリップボードにコピーしました！');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('クリップボード書き込み失敗:', err);
    }
  };

  // カテゴリバッジのカラー指定
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case '自分用':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/30 ring-purple-500/10';
      case 'はぁもにぃ永平寺用':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30 ring-emerald-500/10';
      case '他社向け用':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/30 ring-amber-500/10';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-950/30 backdrop-blur-md">
      
      {/* 1. サムネイル画像プレビュー領域 */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden border-b border-slate-800/80">
        {thumbnailUrl && !imgError ? (
          <img
            src={thumbnailUrl}
            alt={`${app.name} のスクリーンショット`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          /* 画像非表示 / エラー時プレースホルダー */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 text-slate-600">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 mb-2">
              {app.appUrl ? (
                <Globe className="w-6 h-6 text-indigo-400/70" />
              ) : (
                <ImageOff className="w-6 h-6 text-slate-600" />
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-500 truncate max-w-[80%] text-center">
              {app.appUrl ? app.name : 'WebアプリURL未登録'}
            </span>
          </div>
        )}

        {/* サムネイル左上: カテゴリバッジ */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border shadow-md backdrop-blur-md ${getCategoryBadge(
              app.category
            )}`}
          >
            {app.category}
          </span>
        </div>

        {/* サムネイル右上: アクションボタン群 */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/10 shadow-lg">
          <button
            onClick={() => onEdit(app)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="編集"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(app.id, app.name)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="削除"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* WebアプリURLが存在する場合のオーバーレイ起動ボタン */}
        {app.appUrl && (
          <a
            href={app.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-xs font-bold text-white bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"
          >
            <span className="px-4 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 backdrop-blur-md border border-indigo-400/30 flex items-center gap-1.5 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <ExternalLink className="w-4 h-4" />
              <span>Webアプリを開く</span>
            </span>
          </a>
        )}
      </div>

      {/* 2. カード本体領域 */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* アプリタイトル & Webアプリ起動ボタン（URLがある場合） */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-1">
              {app.name}
            </h3>

            {app.appUrl && (
              <a
                href={app.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors"
                title="新しいタブで開く"
              >
                <span>開く</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* プロジェクト名 */}
          {app.projectName && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-500" />
              <span>PJ: {app.projectName}</span>
            </p>
          )}

          {/* Geminiモデル & APIキー識別名バッジ群 */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-indigo-300">
              <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="font-mono font-medium">{app.model}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-emerald-300">
              <Key className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-mono text-slate-300">{app.apiKeyName}</span>
            </div>
          </div>

          {/* ローカルフォルダパス (ワンタップコピー機能) */}
          <div className="mt-4">
            <div className="text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1">
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>ローカルフォルダ</span>
            </div>
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800/90 group/copy hover:border-slate-700 transition-colors">
              <span
                className="text-xs font-mono text-slate-300 truncate select-all"
                title={app.folderPath || 'パス未設定'}
              >
                {app.folderPath || 'パス未登録'}
              </span>
              {app.folderPath && (
                <button
                  onClick={handleCopyPath}
                  className={`p-1.5 rounded-lg transition-all shrink-0 ${
                    isCopied
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white'
                  }`}
                  title="フォルダパスをコピー"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          {/* メモ（利用目的・備考）折りたたみ表示 */}
          {app.memo && (
            <div className="mt-4 pt-3 border-t border-slate-800/60">
              <button
                onClick={() => setIsMemoExpanded(!isMemoExpanded)}
                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors py-0.5"
              >
                <span className="font-medium">利用目的・メモ</span>
                {isMemoExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <div
                className={`text-xs text-slate-300 leading-relaxed transition-all duration-200 overflow-hidden ${
                  isMemoExpanded ? 'max-h-48 mt-1.5 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/40' : 'line-clamp-2 mt-1 opacity-80'
                }`}
              >
                {app.memo}
              </div>
            </div>
          )}
        </div>

        {/* 3. カードフッター: 更新日 */}
        <div className="mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-500">
          <div className="truncate max-w-[60%]">
            {app.appUrl && (
              <span className="text-slate-400 truncate block font-mono">
                {app.appUrl.replace(/^https?:\/\//, '')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Calendar className="w-3 h-3" />
            <span>更新: {new Date(app.updatedAt).toLocaleDateString('ja-JP')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
