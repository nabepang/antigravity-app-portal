import React, { useRef } from 'react';
import { PlusCircle, Download, Upload, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onExportJSON: () => void;
  onImportJSON: (jsonStr: string) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  onExportJSON,
  onImportJSON,
  onResetData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportJSON(content);
      }
    };
    reader.readAsText(file);
    // 入力値をリセット
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* タイトル・ブランド表示 */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Antigravity アプリ管理ポータル
                </h1>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Dashboard
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                Google Antigravityで開発した各アプリの情報を統合管理
              </p>
            </div>
          </div>

          {/* セキュリティ注記バナー */}
          <div className="hidden md:flex items-center px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              <strong>安全設計:</strong> APIキーはシークレット本体ではなく「名称・識別子」のみを保持します
            </span>
          </div>

          {/* アクションボタン群 */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-sm font-medium shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>新規アプリ登録</span>
            </button>

            <div className="h-6 w-[1px] bg-slate-800 hidden sm:block mx-1" />

            <button
              onClick={onExportJSON}
              title="データをJSONファイルでエクスポート"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">バックアップ (JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              title="JSONファイルを読み込んでインポート"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">復元 (JSON)</span>
            </button>

            <button
              onClick={onResetData}
              title="サンプルデータに初期化"
              className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* 隠しインポートインプット */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
            />
          </div>

        </div>
      </div>
    </header>
  );
};
