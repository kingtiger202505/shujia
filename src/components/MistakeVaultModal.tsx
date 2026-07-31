import React from 'react';
import { Question } from '../types';
import { X, BookOpenCheck, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { QUESTIONS_DATABASE } from '../data/questionsData';

interface MistakeVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  mistakeIds: string[];
  onRemoveMistake: (questionId: string) => void;
  onSolveQuestionInPractice: (question: Question) => void;
}

export const MistakeVaultModal: React.FC<MistakeVaultModalProps> = ({
  isOpen,
  onClose,
  mistakeIds,
  onRemoveMistake,
  onSolveQuestionInPractice,
}) => {
  if (!isOpen) return null;

  const mistakeQuestions = QUESTIONS_DATABASE.filter((q) => mistakeIds.includes(q.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col h-[82vh] overflow-hidden border border-rose-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <BookOpenCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                错题宝典本 (Mistake Vault)
                <span className="bg-white text-rose-700 text-xs font-black px-2.5 py-0.5 rounded-full">
                  {mistakeQuestions.length} 道待复习
                </span>
              </h3>
              <p className="text-xs text-rose-100">吃透错题是数学取得高分最重要的秘诀！</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {mistakeQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 text-gray-500 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl">
                🌟
              </div>
              <h4 className="font-bold text-lg text-gray-800">太棒啦！错题本空空如也！</h4>
              <p className="text-xs text-gray-500 max-w-xs">
                你还没有遇到做错的题目，或者所有的错题都已经成功重做消除啦！
              </p>
            </div>
          ) : (
            mistakeQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    错题 #{idx + 1} • {q.category === 'calc' ? '计算巧算' : q.category === 'word' ? '应用题' : '逻辑推理'}
                  </span>
                  
                  <button
                    onClick={() => onRemoveMistake(q.id)}
                    className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    已掌握并剔除
                  </button>
                </div>

                <h4 className="font-bold text-gray-900 text-base">{q.title}</h4>
                {q.subtitle && <p className="text-xs text-gray-600">{q.subtitle}</p>}

                <div className="p-3 bg-amber-50/60 rounded-xl text-xs text-amber-900 font-medium">
                  <strong>💡 考点提示：</strong>{q.keyPoint}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      onSolveQuestionInPractice(q);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    再次挑战这道题
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <span>💡 重新做对错题即可清除记录并奖励金币！</span>
          <button
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-4 py-2 rounded-xl transition-all"
          >
            完成查看
          </button>
        </div>
      </div>
    </div>
  );
};
