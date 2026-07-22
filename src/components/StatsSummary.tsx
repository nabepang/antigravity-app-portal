import React from 'react';
import type { FilterCategory } from '../types/app';
import { Layers, User, Building2, Briefcase, Cpu } from 'lucide-react';

interface StatsSummaryProps {
  categoryCounts: Record<FilterCategory, number>;
  totalModelsCount: number;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  categoryCounts,
  totalModelsCount,
}) => {
  const cards = [
    {
      title: '総登録アプリ数',
      count: categoryCounts['すべて'] || 0,
      subText: `${totalModelsCount} 種類のモデルを使用中`,
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      bgGradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
      borderColor: 'border-indigo-500/20',
    },
    {
      title: '1. 自分用',
      count: categoryCounts['自分用'] || 0,
      subText: '個人開発・検証',
      icon: <User className="w-5 h-5 text-purple-400" />,
      bgGradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-500/20',
    },
    {
      title: '2. はぁもにぃ永平寺用',
      count: categoryCounts['はぁもにぃ永平寺用'] || 0,
      subText: '施設・業務自動化',
      icon: <Building2 className="w-5 h-5 text-emerald-400" />,
      bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: '3. 他社向け用',
      count: categoryCounts['他社向け用'] || 0,
      subText: 'DXコンサル・顧客デモ',
      icon: <Briefcase className="w-5 h-5 text-amber-400" />,
      bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-2xl bg-slate-900/60 border ${card.borderColor} bg-gradient-to-br ${card.bgGradient} backdrop-blur-md flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{card.title}</span>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">{card.icon}</div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white tracking-tight">{card.count}</span>
              <span className="text-[11px] text-slate-500 font-medium">apps</span>
            </div>
            {card.subText && (
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                {idx === 0 && <Cpu className="w-3 h-3 text-indigo-400 shrink-0" />}
                <span>{card.subText}</span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
