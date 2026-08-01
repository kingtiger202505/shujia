import React, { useState } from 'react';
import { Question, QuestionCategory, UserProgress } from '../types';
import { QuestionCard } from './QuestionCard';
import { Zap, BookOpen, Layers, Check, Copy, ArrowRight, Play } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface DailyPracticeViewProps {
  questions: Question[];
  userProgress: UserProgress;
  onAnswerSubmit: (questionId: string, selectedIndex: number, isCorrect: boolean) => void;
  onOpenScratchpad: () => void;
  onGenerateCustomQuestions: (grade: any, subject: any, category: any, count: number) => void;
}

export const DailyPracticeView: React.FC<DailyPracticeViewProps> = ({
  questions,
  userProgress,
  onAnswerSubmit,
  onOpenScratchpad,
  onGenerateCustomQuestions,
}) => {
  const [selectedCat, setSelectedCat] = useState<'all' | QuestionCategory>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Unified generator config state
  const [genCount, setGenCount] = useState<number>(5);
  const [genCategory, setGenCategory] = useState<string>('all');
  const [generateFeedback, setGenerateFeedback] = useState<string | null>(null);

  const currentSubject = userProgress.selectedSubject || 'math';

  // Get categories available for current subject
  const categories = currentSubject === 'math' ? [
    { id: 'all', label: '🗂️ 全部类别' },
    { id: 'multiplication_table', label: '⚡ 乘法口诀' },
    { id: 'calc', label: '🧮 计算巧算' },
    { id: 'word', label: '🎒 应用题' },
    { id: 'logic', label: '🧩 逻辑推理' },
  ] : currentSubject === 'chinese' ? [
    { id: 'all', label: '🗂️ 全部类别' },
    { id: 'chinese_vocab', label: '📖 拼音成语积累' },
    { id: 'chinese_reading', label: '📜 诗词鉴赏与阅读' },
  ] : [
    { id: 'all', label: '🗂️ 全部类别' },
    { id: 'english_vocab', label: '🔤 词汇分类特训' },
    { id: 'english_grammar', label: '✍️ 语法与情景交际' },
  ];

  // Filtering questions for display
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

  // Run dynamic generation of questions
  const handleGenerateNow = () => {
    soundManager.playStar();
    onGenerateCustomQuestions(
      userProgress.selectedGrade,
      currentSubject,
      genCategory === 'all' ? undefined : genCategory,
      genCount
    );

    // Filter to the generated category automatically for seamless user experience
    setSelectedCat(genCategory as any);
    setCurrentIndex(0);

    // Show feedback toast
    const catLabel = categories.find(c => c.id === genCategory)?.label || '精选题';
    setGenerateFeedback(`✨ 成功动态生成 ${genCount} 道全新的【${catLabel}】考题！快来练习吧！`);
    setTimeout(() => {
      setGenerateFeedback(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Dynamic Question Generator Config Panel (统一自主智能出题中心) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100 shadow-md">
        <div className="border-b border-gray-100 pb-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 fill-indigo-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1.5">
                沪教版全科题库智能自主出题
                <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  统一极速入口
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                可自由配置题目的分类和出题数量，点击即可瞬间动态扩充全新智能模拟题。
              </p>
            </div>
          </div>
          
          <div className="text-xs font-bold text-indigo-700 bg-indigo-50/50 border border-indigo-100/80 px-3 py-1.5 rounded-xl self-start md:self-auto">
            当前总题库：{questions.length} 道精选考题
          </div>
        </div>

        {/* Configurations grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Category Dropdown Selection */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="block text-xs font-extrabold text-gray-700 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>选择练习科目类别</span>
            </label>
            <select
              value={genCategory}
              onChange={(e) => setGenCategory(e.target.value)}
              className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs sm:text-sm text-gray-800 font-bold px-3 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Question Count Selection */}
          <div className="sm:col-span-4 space-y-1.5">
            <label className="block text-xs font-extrabold text-gray-700 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>设定单次出题数量</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setGenCount(count)}
                  className={`py-2 rounded-2xl text-xs font-black transition-all border ${
                    genCount === count
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {count} 道题
                </button>
              ))}
            </div>
          </div>

          {/* Trigger button */}
          <div className="sm:col-span-3">
            <button
              onClick={handleGenerateNow}
              className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm py-2.5 rounded-2xl shadow-md transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-200" />
              <span>⚡ 立即智能生成</span>
            </button>
          </div>
        </div>

        {/* Toast Feedback */}
        {generateFeedback && (
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-2xl text-xs font-bold animate-fadeIn flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>{generateFeedback}</span>
          </div>
        )}
      </div>

      {/* Main Solver Area Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
        <span className="text-xs font-extrabold text-gray-500 flex items-center gap-1">
          筛选列表：
        </span>
        <div className="flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCat(cat.id as any);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs font-bold ${
                selectedCat === cat.id
                  ? 'bg-white text-indigo-600 border border-indigo-100 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question view */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-200 space-y-4 shadow-2xs">
          <Zap className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
          <h3 className="font-bold text-gray-800 text-lg">当前列表没有题目啦</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            请在上方【智能自主出题中心】里配置好科目和题数，点击【立即智能生成】即可极速生成专属你个人的沪教版精选题库！
          </p>
          <button
            onClick={handleGenerateNow}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>⚡ 默认生成 5 道全新试题</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          <QuestionCard
            question={currentQuestion}
            questionIndex={currentIndex}
            totalQuestions={filtered.length}
            onAnswerSubmit={onAnswerSubmit}
            onOpenScratchpad={onOpenScratchpad}
            onOpenAiCoachForQuestion={() => {}} // No longer using AI coach
            previouslyAnsweredIndex={userProgress.completedQuestions[currentQuestion.id]}
          />

          {/* Navigation Controls */}
          <div className="flex items-center justify-between px-1 sm:px-2 gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 disabled:opacity-40 font-bold text-xs rounded-xl transition-all shadow-2xs"
            >
              ⬅️ 上一题
            </button>

            <span className="text-[11px] sm:text-xs font-extrabold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              列表位置：{currentIndex + 1} / {filtered.length}
            </span>

            {currentIndex === filtered.length - 1 ? (
              <button
                onClick={() => {
                  // Direct dynamic generation of next count of questions for continuous learning
                  onGenerateCustomQuestions(userProgress.selectedGrade, currentSubject, genCategory === 'all' ? undefined : genCategory, genCount);
                  setCurrentIndex(currentIndex + 1);
                  soundManager.playStar();
                }}
                className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                <span>⚡ 动态追加下一批考题</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
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
