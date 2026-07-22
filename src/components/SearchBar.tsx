import React from 'react';
import { Search, X, Cpu, Key, FilterX } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  // 動的モデルフィルター
  availableModels: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  // 動的APIキーフィルター
  availableApiKeys: string[];
  selectedApiKey: string;
  onApiKeyChange: (apiKey: string) => void;
  // リセット
  onResetFilters: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  availableModels,
  selectedModel,
  onModelChange,
  availableApiKeys,
  selectedApiKey,
  onApiKeyChange,
  onResetFilters,
}) => {
  const hasActiveFilters = searchQuery !== '' || selectedModel !== 'すべて' || selectedApiKey !== 'すべて';

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
      
      {/* 1. キーワード検索バー (アプリ名、プロジェクト名、メモ、パスから検索) */}
      <div className="relative flex-1 min-w-[240px]">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="アプリ名、メモ、パスからキーワード検索..."
          className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
            title="キーワードをクリア"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. 動的モデル ドロップダウンフィルター */}
      <div className="relative min-w-[180px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400">
          <Cpu className="w-3.5 h-3.5" />
        </div>
        <select
          value={selectedModel}
          onChange={e => onModelChange(e.target.value)}
          className={`w-full pl-9 pr-8 py-2.5 bg-slate-950/80 border rounded-xl text-xs font-mono transition-all appearance-none cursor-pointer focus:outline-none focus:ring-1 ${
            selectedModel !== 'すべて'
              ? 'border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/30'
              : 'border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <option value="すべて">すべてのモデル</option>
          {availableModels.map(model => (
            <option key={model} value={model}>
              {model === '未使用' ? 'モデル: 未使用' : model}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
          ▼
        </div>
      </div>

      {/* 3. 動的APIキー名称 ドロップダウンフィルター */}
      <div className="relative min-w-[190px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
          <Key className="w-3.5 h-3.5" />
        </div>
        <select
          value={selectedApiKey}
          onChange={e => onApiKeyChange(e.target.value)}
          className={`w-full pl-9 pr-8 py-2.5 bg-slate-950/80 border rounded-xl text-xs font-mono transition-all appearance-none cursor-pointer focus:outline-none focus:ring-1 ${
            selectedApiKey !== 'すべて'
              ? 'border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
              : 'border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <option value="すべて">すべてのAPIキー</option>
          {availableApiKeys.map(keyName => (
            <option key={keyName} value={keyName}>
              {keyName}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
          ▼
        </div>
      </div>

      {/* 4. 検索・フィルター一括クリアボタン */}
      {hasActiveFilters && (
        <button
          onClick={onResetFilters}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors shrink-0"
          title="すべての検索条件をリセット"
        >
          <FilterX className="w-3.5 h-3.5 text-rose-400" />
          <span>リセット</span>
        </button>
      )}

    </div>
  );
};
