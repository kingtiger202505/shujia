import React, { useState } from 'react';
import { Question, QuestionCategory, UserProgress } from '../types';
import { QuestionCard } from './QuestionCard';
import { Filter, Zap, Sparkles, CheckCircle, RefreshCcw } from 'lucide-react';

interface DailyPracticeViewProps {
  questions: Question[];
  userProgress: UserProgress;
  onAnswerSubmit: (questionId: string, selectedIndex: number, isCorrect: boolean) => void;
  onOpenScratchpad: () => void;
  onOpenAiCoachForQuestion: (question: Question) => void;
  onGenerateMoreAiQuestions: () => void;
}

export const DailyPracticeView: React.FC<DailyPracticeViewProps> = ({
  questions,
  userProgress,
  onAnswerSubmit,
  onOpenScratchpad,
  onOpenAiCoachForQuestion,
  onGenerateMoreAiQuestions,
}) => {
  const [selectedCat, setSelectedCat] = useState<'all' | QuestionCategory>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const filtered = questions.filter((q) => {
    if (selectedCat === 'all') return true;
    return q.category === selectedCat;
  });

  const currentQuestion = filtered[currentIndex];

  const handleNext = () => {
    if (currentIndex < filtered.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-indigo-600" />
            暑期每日刷题与分类特训
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              共 {questions.length} 道考题
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            自由挑选计算题、应用题或逻辑推理训练，题目随时无限AI扩充！
          </p>
        </div>

        {/* Filters and AI generator button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl text-xs font-semibold overflow-x-auto max-w-full no-scrollbar">
            {[
              { id: 'all', label: '全部考题' },
              { id: 'calc', label: '🧮 计算巧算' },
              { id: 'word', label: '🎒 应用题' },
              { id: 'logic', label: '🧩 逻辑推理' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCat(cat.id as any);
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs ${
                  selectedCat === cat.id
                    ? 'bg-white text-indigo-600 font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={onGenerateMoreAiQuestions}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold text-xs px-3.5 py-2 rounded-2xl shadow-sm transition-all shrink-0 active:scale-95"
            title="点击由AI导师实时出题"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
            <span>✨ AI无限生成新题</span>
          </button>
        </div>
      </div>

      {/* Main Solver Area */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-200 space-y-4 shadow-xs">
          <Sparkles className="w-12 h-12 text-indigo-400 mx-auto" />
          <h3 className="font-bold text-gray-800 text-lg">已刷完当前列表题目</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            点击下方按钮，由AI为你智能生成符合沪教版标准的新考题，刷题永不枯竭！
          </p>
          <button
            onClick={onGenerateMoreAiQuestions}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all active:scale-95"
          >
            ✨ 马上生成 5 道全新试题
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <QuestionCard
            question={currentQuestion}
            questionIndex={currentIndex}
            totalQuestions={filtered.length}
            onAnswerSubmit={onAnswerSubmit}
            onOpenScratchpad={onOpenScratchpad}
            onOpenAiCoachForQuestion={onOpenAiCoachForQuestion}
            previouslyAnsweredIndex={userProgress.completedQuestions[currentQuestion.id]}
          />

          {/* Navigation Controls */}
          <div className="flex items-center justify-between px-1 sm:px-2 gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-3 sm:px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 disabled:opacity-40 font-bold text-xs rounded-xl transition-all shadow-2xs"
            >
              ⬅️ 上一题
            </button>

            <span className="text-[11px] sm:text-xs font-semibold text-gray-500">
              {currentIndex + 1} / {filtered.length}
            </span>

            {currentIndex === filtered.length - 1 ? (
              <button
                onClick={() => {
                  onGenerateMoreAiQuestions();
                  setCurrentIndex(currentIndex + 1);
                }}
                className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>无限生成下一题</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
              >
                下一题 ➡️
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
