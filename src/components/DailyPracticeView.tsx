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
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            自由挑选计算题、应用题或逻辑推理训练，巩固旧知，轻松衔接新课！
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl text-xs font-semibold">
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
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedCat === cat.id
                  ? 'bg-white text-indigo-600 font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Solver Area */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4">
          <Sparkles className="w-12 h-12 text-indigo-400 mx-auto" />
          <h3 className="font-bold text-gray-800 text-lg">当前分类下暂无题目</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            点击下方按钮，让“小沪AI数学导师”为你现场生成符合上海教学标准的全新练习题吧！
          </p>
          <button
            onClick={onGenerateMoreAiQuestions}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all"
          >
            ✨ 立即AI生成新题
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
          <div className="flex items-center justify-between px-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 disabled:opacity-40 font-bold text-xs rounded-xl transition-all shadow-2xs"
            >
              ⬅️ 上一题
            </button>

            <span className="text-xs font-semibold text-gray-500">
              进度：{currentIndex + 1} / {filtered.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === filtered.length - 1}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl disabled:opacity-40 transition-all shadow-xs"
            >
              下一题 ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
