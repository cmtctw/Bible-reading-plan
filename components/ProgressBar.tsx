import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, label }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full mb-5">
      <div className="flex justify-between items-end mb-2">
        <span className="text-base font-medium text-stone-700 font-serif">{label}</span>
        <span className="text-sm font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
          {percentage}% ({current}/{total})
        </span>
      </div>
      <div className="w-full bg-stone-200 rounded-full h-3 dark:bg-stone-200">
        <div 
          className="bg-emerald-600 h-3 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};