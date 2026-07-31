import React, { useState, useEffect } from 'react';
import { Subject, GradeLevel, Question } from '../types';
import { QUESTIONS_DATABASE } from '../data/questionsData';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  X,
  BookOpen,
  HelpCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { speechManager } from '../utils/speech';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGrade: GradeLevel;
  onFinishExam: (score: number, totalCoins: number) => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  selectedGrade,
  onFinishExam,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('math');
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [isLoadingAiExam, setIsLoadingAiExam] = useState(false);

  if (!isOpen) return null;

  // 启动考试
  const handleStartExam = async (useAi: boolean = false) => {
    soundManager.playClick();
    setIsLoadingAiExam(true);

    if (useAi) {
      try {
        const response = await fetch('/api/study/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grade: selectedGrade,
            subject: selectedSubject,
            count: 10,
          }),
        });
        const data = await response.json();
        if (data.questions && data.questions.length > 0) {
          setCurrentQuestions(data.questions);
        } else {
          fallbackLocalQuestions();
        }
      } catch (err) {
        console.error('AI exam generate error:', err);
        fallbackLocalQuestions();
      }
    } else {
      fallbackLocalQuestions();
    }

    setIsLoadingAiExam(false);
    setIsExamStarted(true);
    setUserAnswers({});
    setCurrentIndex(0);
    setIsExamSubmitted(false);
  };

  const fallbackLocalQuestions = () => {
    const subjectQuestions = QUESTIONS_DATABASE.filter(
      (q) => q.grade === selectedGrade && (q.subject === selectedSubject || (!q.subject && selectedSubject === 'math'))
    );
    // 乱序抽取10题或全部
    const shuffled = [...subjectQuestions].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 10));
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    soundManager.playClick();
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitExam = () => {
    soundManager.playComplete();
    setIsExamSubmitted(true);

    // 计算得分
    let correctCount = 0;
    currentQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / currentQuestions.length) * 100);
    const earnedCoins = score >= 80 ? 50 : 20;
    onFinishExam(score, earnedCoins);
  };

  // 计算得分结果
  const calculateScore = () => {
    let correctCount = 0;
    currentQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });
    return {
      correctCount,
      totalCount: currentQuestions.length,
      score: Math.round((correctCount / currentQuestions.length) * 100),
    };
  };

  const subjectNames: Record<Subject, string> = {
    math: '数学',
    chinese: '语文',
    english: '英语',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white p-5 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                暑期期末真题模拟大考场
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
                  {selectedGrade === 'g1_to_g2' ? '一升二年级' : '三升四年级'}
                </span>
              </h2>
              <p className="text-amber-100 text-xs">全科高频精选题型 · 沉浸式模拟测试与分析</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isExamStarted ? (
            /* Start Setup Screen */
            <div className="space-y-6 py-4">
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Award className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">准备好挑战期末大考了吗？</h3>
                <p className="text-gray-500 text-sm">
                  真题模拟试卷共 10 道题目，满分 100 分。完成后可获得丰厚金币奖励与智能讲评。
                </p>
              </div>

              {/* Subject Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  选择考试科目
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['math', 'chinese', 'english'] as Subject[]).map((subj) => (
                    <button
                      key={subj}
                      onClick={() => setSelectedSubject(subj)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all font-bold flex flex-col items-center gap-1 ${
                        selectedSubject === subj
                          ? 'border-orange-500 bg-orange-50/80 text-orange-900 shadow-sm'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">
                        {subj === 'math' ? '🧮' : subj === 'chinese' ? '📖' : '🔤'}
                      </span>
                      <span>上海{subjectNames[subj]}衔接卷</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam Instructions */}
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  考场须知
                </div>
                <p>1. 题目包含计算、应用题、逻辑推理与基础语法知识点。</p>
                <p>2. 支持使用草稿纸辅助计算。</p>
                <p>3. 考试得分达 80 分以上可获得 50 金币与期末小状元称号！</p>
              </div>

              {/* Start Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleStartExam(false)}
                  disabled={isLoadingAiExam}
                  className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  开启本地真题测试
                </button>
                <button
                  onClick={() => handleStartExam(true)}
                  disabled={isLoadingAiExam}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                >
                  {isLoadingAiExam ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  AI 实时生成期末模拟卷
                </button>
              </div>
            </div>
          ) : !isExamSubmitted ? (
            /* Active Exam View */
            <div className="space-y-6">
              {/* Progress & Title Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800">
                    {subjectNames[selectedSubject]}期末考卷
                  </span>
                  <span className="text-xs text-gray-500">
                    第 <strong className="text-gray-900">{currentIndex + 1}</strong> / {currentQuestions.length} 题
                  </span>
                  <button
                    onClick={() => {
                      const q = currentQuestions[currentIndex];
                      if (!q) return;
                      const lang = selectedSubject === 'english' ? 'en-US' : 'zh-CN';
                      speechManager.speak(`${q.title}。${q.subtitle || ''} ${q.expression || ''}`, lang);
                    }}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 transition-all font-semibold ml-2"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>朗读题目</span>
                  </button>
                </div>
                <div className="flex gap-1">
                  {currentQuestions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-5 h-2 rounded-full transition-all ${
                        userAnswers[idx] !== undefined
                          ? 'bg-amber-500'
                          : idx === currentIndex
                          ? 'bg-amber-300 ring-2 ring-amber-200'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question Box */}
              {currentQuestions[currentIndex] && (
                <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200 space-y-4">
                  <h4 className="text-lg font-bold text-gray-900">
                    {currentIndex + 1}. {currentQuestions[currentIndex].title}
                  </h4>
                  {currentQuestions[currentIndex].subtitle && (
                    <p className="text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100 font-medium">
                      {currentQuestions[currentIndex].subtitle}
                    </p>
                  )}
                  {currentQuestions[currentIndex].expression && (
                    <div className="text-center py-3 bg-amber-50 text-amber-950 font-mono text-2xl font-bold rounded-xl border border-amber-200">
                      {currentQuestions[currentIndex].expression}
                    </div>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {currentQuestions[currentIndex].options.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(currentIndex, optIdx)}
                        className={`p-4 rounded-xl text-left transition-all border-2 font-medium flex items-center justify-between ${
                          userAnswers[currentIndex] === optIdx
                            ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm font-bold'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center font-bold shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          {option}
                        </span>
                        {userAnswers[currentIndex] === optIdx && (
                          <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Exam Navigation Footer */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm font-bold hover:bg-gray-100 disabled:opacity-40"
                >
                  上一题
                </button>

                {currentIndex < currentQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-1"
                  >
                    下一题
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-200 hover:brightness-105 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    提交考卷
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="py-6 text-center space-y-6">
              {(() => {
                const result = calculateScore();
                return (
                  <>
                    <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-orange-200 animate-bounce">
                      <span className="text-3xl font-extrabold">{result.score}分</span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {result.score >= 90
                          ? '🎉 哇！太厉害了，全优期末状元！'
                          : result.score >= 70
                          ? '🌟 表现不错！继续加油更加精通！'
                          : '💪 基础再巩固一下，暑期打好功底！'}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        共 {result.totalCount} 题，做对 {result.correctCount} 题
                      </p>
                    </div>

                    {/* Review List */}
                    <div className="text-left bg-gray-50 p-4 rounded-2xl border border-gray-200 max-h-60 overflow-y-auto space-y-3">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        答题明细与解析
                      </h4>
                      {currentQuestions.map((q, idx) => {
                        const isCorrect = userAnswers[idx] === q.correctIndex;
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border text-xs space-y-1 ${
                              isCorrect
                                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                                : 'bg-rose-50/50 border-rose-200 text-rose-950'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span>
                                {idx + 1}. {q.title}
                              </span>
                              {isCorrect ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> 正确 (+10分)
                                </span>
                              ) : (
                                <span className="text-rose-600 font-bold flex items-center gap-0.5">
                                  <XCircle className="w-3.5 h-3.5" /> 错误
                                </span>
                              )}
                            </div>
                            {!isCorrect && (
                              <div className="text-gray-600 pt-1">
                                <div>你的选择: {q.options[userAnswers[idx]] || '未作答'}</div>
                                <div className="text-emerald-700 font-semibold">
                                  正确答案: {q.options[q.correctIndex]}
                                </div>
                                <div className="mt-1 text-gray-500 italic">{q.keyPoint}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setIsExamStarted(false);
                          setIsExamSubmitted(false);
                        }}
                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm"
                      >
                        再考一次
                      </button>
                      <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm shadow-md"
                      >
                        确认领奖并返回
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
