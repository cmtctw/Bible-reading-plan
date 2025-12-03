import React, { useState } from 'react';
import { BookData, AIInsight } from '../types';
import { fetchBookInsight } from '../services/ai';

interface BookCardProps {
  book: BookData;
  progress: Record<string, boolean>;
  onToggle: (bookName: string, chapter: number) => void;
  onToggleBook: (bookName: string, totalChapters: number, completed: boolean) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  progress, 
  onToggle,
  onToggleBook,
  isExpanded,
  onToggleExpand
}) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInsight, setShowInsight] = useState(false);

  let completed = 0;
  for (let i = 1; i <= book.chapters; i++) {
    if (progress[`${book.name}-${i}`]) completed++;
  }
  const isComplete = completed === book.chapters;
  const hasStarted = completed > 0;

  const handleGetInsight = async () => {
    if (insight) {
      setShowInsight(!showInsight);
      return;
    }
    
    setLoading(true);
    const data = await fetchBookInsight(book.name);
    if (data) {
      setInsight(data);
      setShowInsight(true);
    }
    setLoading(false);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${isComplete ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-stone-200'}`}>
      <div 
        className="px-4 py-3 flex justify-between items-center cursor-pointer select-none relative overflow-hidden"
        onClick={onToggleExpand}
      >
        {hasStarted && !isComplete && (
           <div className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 opacity-30" style={{ width: `${(completed / book.chapters) * 100}%` }}></div>
        )}
        
        <div className="flex items-baseline gap-2 overflow-hidden">
          <h3 className="text-xl font-bold text-stone-800 font-serif whitespace-nowrap">{book.zhName}</h3>
          <span className="text-xs text-stone-500 font-sans whitespace-nowrap pt-1">共 {book.chapters} 章</span>
        </div>
        
        <div className="flex items-center gap-2 pl-2">
           <button 
              onClick={(e) => { e.stopPropagation(); onToggleBook(book.name, book.chapters, true); }}
              className="text-xs font-medium px-2 py-1 rounded text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
           >
              全選
           </button>
           <button 
              onClick={(e) => { e.stopPropagation(); onToggleBook(book.name, book.chapters, false); }}
              className="text-xs font-medium px-2 py-1 rounded text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
           >
              清除
           </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-stone-100 bg-[#FDFBF7] p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-4">
             <div className="text-xs text-stone-400 font-mono">
                {book.name} • 已讀 {completed}/{book.chapters}
             </div>
             <button
               onClick={handleGetInsight}
               disabled={loading}
               className="text-xs flex items-center gap-1 text-amber-600 hover:text-amber-800 transition-colors"
             >
               {loading ? '載入中...' : (showInsight ? '隱藏簡介' : 'AI 簡介')}
               {!loading && !showInsight && (
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
               )}
             </button>
          </div>

          {showInsight && insight && (
            <div className="bg-amber-50 p-3 rounded-lg text-sm text-stone-700 border border-amber-100 mb-4">
              <p className="mb-2">{insight.summary}</p>
              <p className="font-serif text-amber-900 border-l-2 border-amber-300 pl-2 italic">"{insight.keyVerse}"</p>
            </div>
          )}

          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map((chapter) => {
              const key = `${book.name}-${chapter}`;
              const isChecked = !!progress[key];
              return (
                <button
                  key={chapter}
                  onClick={() => onToggle(book.name, chapter)}
                  className={`
                    aspect-square rounded flex items-center justify-center text-sm font-medium transition-all duration-200 border
                    ${isChecked 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                      : 'bg-white border-stone-200 text-stone-400 hover:border-emerald-400 hover:text-emerald-600 hover:bg-white'}
                  `}
                >
                  {chapter}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};