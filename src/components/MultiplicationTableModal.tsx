import React, { useState, useEffect } from 'react';
import { Sparkles, X, Volume2, Trophy, Clock, CheckCircle2, RotateCcw, Zap, BookOpen } from 'lucide-react';
import { generateBatchQuestions } from '../utils/questionGenerator';
import { Question } from '../types';
import { speechManager } from '../utils/speech';

interface MultiplicationTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardCoins: (amount: number) => void;
}

// 汉字口诀对照
const CHINESE_NUMS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const CHINESE_PRODUCTS: Record<number, string> = {
  1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十',
  12: '十二', 14: '十四', 15: '十五', 16: '十六', 18: '十八', 20: '二十', 21: '二十一',
  24: '二十四', 25: '二十五', 27: '二十七', 28: '二十八', 30: '三十', 32: '三十二',
  35: '三十五', 36: '三十六', 40: '四十', 42: '四十二', 45: '四十五', 48: '四十八',
  49: '四十九', 54: '五十四', 56: '五十六', 63: '六十三', 64: '六十四', 72: '七十二', 81: '八十一'
};

export const MultiplicationTableModal: React.FC<MultiplicationTableModalProps> = ({
  isOpen,
  onClose,
  onRewardCoins
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'challenge'>('challenge');
  
  // Matrix view selected cell
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);

  // Challenge Mode States
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Start new challenge
  const startNewChallenge = () => {
    const qList = generateBatchQuestions(10, 'g1_to_g2', 'math', 'multiplication_table');
    setQuestions(qList);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setSeconds(0);
    setIsFinished(false);
  };

  useEffect(() => {
    if (isOpen) {
      startNewChallenge();
    }
  }, [isOpen]);

  // Timer
  useEffect(() => {
    if (!isOpen || isFinished || activeTab !== 'challenge') return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isFinished, activeTab]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null || isFinished) return;
    setSelectedOption(index);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 10);
      onRewardCoins(5); // +5 coins per correct
      speechManager.speak('回答正确！加5金币！');
    } else {
      speechManager.speak('再想想看哦！');
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((i) => i + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
        speechManager.speak(`背诵大闯关完成！得分 ${score + (isCorrect ? 10 : 0)} 分！`);
      }
    }, 1200);
  };

  const getSlogan = (r: number, c: number) => {
    const min = Math.min(r, c);
    const max = Math.max(r, c);
    const prod = min * max;
    return `${CHINESE_NUMS[min]}${CHINESE_NUMS[max]}${CHINESE_PRODUCTS[prod] || prod}`;
  };

  const handleSpeakCell = (r: number, c: number) => {
    const slogan = getSlogan(r, c);
    setSelectedCell({ r, c });
    speechManager.speak(`${r} 乘 ${c} 等于 ${r * c}。口诀：${slogan}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col h-[90vh] sm:h-[86vh] overflow-hidden border border-amber-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-yellow-200 fill-yellow-200" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 leading-tight">
                九九乘法口诀速算大闯关 ⚡
              </h3>
              <p className="text-[11px] sm:text-xs text-amber-100">沪教版二年级核心必备 · 口诀背诵与极速对决</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Tab Bar */}
        <div className="bg-amber-50/80 border-b border-amber-100 px-4 py-2 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-amber-200/50 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('challenge')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'challenge'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>速算闯关模式</span>
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'matrix'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>九九乘法表全图</span>
            </button>
          </div>

          {activeTab === 'challenge' && !isFinished && (
            <div className="flex items-center gap-3 text-xs font-bold text-amber-900">
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-2xs border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {seconds}s
              </span>
              <span className="bg-amber-500 text-white px-2.5 py-1 rounded-full shadow-2xs">
                得分: {score}
              </span>
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-amber-50/20">
          {activeTab === 'matrix' ? (
            /* 九九乘法表 Matrix View */
            <div className="space-y-4">
              <div className="text-center bg-white p-3 rounded-2xl border border-amber-200 shadow-2xs">
                <h4 className="font-bold text-amber-900 text-sm sm:text-base">
                  💡 点击表格任意单元格，听取朗读口诀！
                </h4>
                {selectedCell ? (
                  <p className="text-xs font-bold text-amber-600 mt-1 animate-pulse">
                    口诀：“{getSlogan(selectedCell.r, selectedCell.c)}” ({selectedCell.r} × {selectedCell.c} = {selectedCell.r * selectedCell.c})
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-0.5">点击下方数字试一试吧</p>
                )}
              </div>

              {/* Grid 1x1 to 9x9 */}
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[500px] grid grid-cols-9 gap-1.5 bg-amber-100/60 p-2 rounded-2xl border border-amber-200">
                  {Array.from({ length: 9 }).map((_, rowIndex) => {
                    const r = rowIndex + 1;
                    return Array.from({ length: 9 }).map((_, colIndex) => {
                      const c = colIndex + 1;
                      if (c > r) {
                        return <div key={`empty_${r}_${c}`} className="bg-amber-50/30 rounded-xl" />;
                      }
                      const prod = r * c;
                      const slogan = getSlogan(r, c);
                      const isSelected = selectedCell?.r === r && selectedCell?.c === c;

                      return (
                        <button
                          key={`cell_${r}_${c}`}
                          onClick={() => handleSpeakCell(r, c)}
                          className={`p-2 rounded-xl text-center border transition-all active:scale-95 ${
                            isSelected
                              ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105 z-10'
                              : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-200/80 shadow-2xs'
                          }`}
                        >
                          <div className="text-[11px] sm:text-xs font-black">{r}×{c}={prod}</div>
                          <div className={`text-[9px] sm:text-[10px] mt-0.5 truncate ${isSelected ? 'text-yellow-200 font-bold' : 'text-amber-700/80'}`}>
                            {slogan}
                          </div>
                        </button>
                      );
                    });
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* 速算闯关 Challenge Mode */
            <div>
              {isFinished ? (
                /* Results */
                <div className="bg-white rounded-3xl p-6 sm:p-10 text-center border border-amber-200 space-y-5 max-w-lg mx-auto shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900">闯关成功！获得奖励 💰</h3>
                    <p className="text-xs text-gray-500 mt-1">用时：{seconds} 秒 · 总得分：{score} 分</p>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex justify-around text-center">
                    <div>
                      <span className="text-xs text-gray-500">答对题数</span>
                      <p className="text-lg font-bold text-amber-600">{score / 10} / {questions.length}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">赢得金币</span>
                      <p className="text-lg font-bold text-yellow-600">+{(score / 10) * 5} 🪙</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={startNewChallenge}
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-2xl shadow-md transition-all active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>再闯关一次</span>
                    </button>
                  </div>
                </div>
              ) : currentQ ? (
                /* Question Playing Card */
                <div className="max-w-xl mx-auto space-y-4">
                  {/* Progress Header */}
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span>第 {currentIndex + 1} / {questions.length} 题</span>
                    <div className="w-36 h-2.5 bg-amber-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md space-y-6 text-center">
                    <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                      {currentQ.title}
                    </div>

                    {currentQ.expression && (
                      <div className="text-3xl sm:text-4xl font-black text-amber-900 tracking-wider py-2 font-mono">
                        {currentQ.expression}
                      </div>
                    )}

                    {currentQ.subtitle && (
                      <p className="text-sm sm:text-base font-bold text-gray-800 leading-relaxed">
                        {currentQ.subtitle}
                      </p>
                    )}

                    {/* Speech Button */}
                    <button
                      onClick={() => speechManager.speak(currentQ.subtitle || currentQ.expression || currentQ.title)}
                      className="inline-flex items-center gap-1 text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>朗读题目</span>
                    </button>

                    {/* Options Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {currentQ.options.map((opt, idx) => {
                        let btnStyle = 'bg-amber-50/60 hover:bg-amber-100/80 border-amber-200 text-amber-900';
                        if (selectedOption !== null) {
                          if (idx === currentQ.correctIndex) {
                            btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102';
                          } else if (idx === selectedOption) {
                            btnStyle = 'bg-rose-500 text-white border-rose-600';
                          } else {
                            btnStyle = 'opacity-40 bg-gray-100 text-gray-400 border-gray-200';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
                            disabled={selectedOption !== null}
                            className={`p-3.5 sm:p-4 rounded-2xl font-black text-base sm:text-lg border transition-all shadow-xs active:scale-95 text-center ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Keypoint Tip */}
                  {selectedOption !== null && (
                    <div className="bg-amber-100/80 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 animate-fadeIn">
                      <span className="font-bold">💡 考点记忆：</span>{currentQ.keyPoint}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
