import React from 'react';
import type { FilterCategory } from '../types/app';
import { Layers, User, Building2, Briefcase } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
  categoryCounts: Record<FilterCategory, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const tabs: { key: FilterCategory; label: string; icon: React.ReactNode; color: string }[] = [
    {
      key: 'すべて',
      label: 'すべて',
      icon: <Layers className="w-4 h-4" />,
      color: 'from-slate-600 to-slate-500',
    },
    {
      key: '自分用',
      label: '1. 自分用',
      icon: <User className="w-4 h-4" />,
      color: 'from-purple-600 to-indigo-600',
    },
    {
      key: 'はぁもにぃ永平寺用',
      label: '2. はぁもにぃ永平寺用',
      icon: <Building2 className="w-4 h-4" />,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      key: '他社向け用',
      label: '3. 他社向け用',
      icon: <Briefcase className="w-4 h-4" />,
      color: 'from-amber-600 to-orange-600',
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map(tab => {
        const isSelected = selectedCategory === tab.key;
        const count = categoryCounts[tab.key] || 0;

        return (
          <button
            key={tab.key}
            onClick={() => onSelectCategory(tab.key)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shrink-0 border ${
              isSelected
                ? 'bg-slate-800 text-white border-indigo-500/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            <span className={isSelected ? 'text-indigo-400' : 'text-slate-500'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                isSelected
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700/50'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
