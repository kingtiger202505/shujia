/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GradeLevel, Subject, Question, UserProgress, Chapter } from './types';
import { CHAPTERS_DATA, QUESTIONS_DATABASE } from './data/questionsData';
import { generateBatchQuestions } from './utils/questionGenerator';
import { HeaderNavbar } from './components/HeaderNavbar';
import { AdventureMap } from './components/AdventureMap';
import { DailyPracticeView } from './components/DailyPracticeView';
import { QuestionCard } from './components/QuestionCard';
import { ScratchpadModal } from './components/ScratchpadModal';
import { AiMathCoachModal } from './components/AiMathCoachModal';
import { MistakeVaultModal } from './components/MistakeVaultModal';
import { ShopAndPetModal } from './components/ShopAndPetModal';
import { WorksheetExportModal } from './components/WorksheetExportModal';
import { ExamModal } from './components/ExamModal';
import { MultiplicationTableModal } from './components/MultiplicationTableModal';
import { ArrowLeft, Sparkles, CheckCircle, Award } from 'lucide-react';

const INITIAL_USER_PROGRESS: UserProgress = {
  selectedGrade: 'g1_to_g2',
  selectedSubject: 'math',
  studentName: '小沪学霸',
  goldCoins: 120,
  starsCount: 8,
  unlockedChapters: ['g1_ch1', 'g1_ch2', 'g1_ch3', 'g3_ch1', 'g3_ch2', 'g3_ch3', 'g1_chi_ch1', 'g3_chi_ch1', 'g1_eng_ch1', 'g3_eng_ch1'],
  chapterStars: { g1_ch1: 3, g3_ch1: 2 },
  completedQuestions: {},
  mistakes: [],
  examHistory: [],
  petLevel: 1,
  petName: '算力小豆',
  petExp: 40,
  ownedEquipment: [],
  equippedHat: null,
  badges: [],
  dailyStreakDays: 3,
  lastPracticeDate: new Date().toISOString().slice(0, 10),
};

export default function App() {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('shanghai_math_summer_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_USER_PROGRESS,
          ...parsed,
          mistakes: Array.isArray(parsed?.mistakes) ? parsed.mistakes : [],
          ownedEquipment: Array.isArray(parsed?.ownedEquipment) ? parsed.ownedEquipment : [],
          unlockedChapters: Array.isArray(parsed?.unlockedChapters) && parsed.unlockedChapters.length > 0 ? parsed.unlockedChapters : INITIAL_USER_PROGRESS.unlockedChapters,
          chapterStars: parsed?.chapterStars && typeof parsed.chapterStars === 'object' ? parsed.chapterStars : INITIAL_USER_PROGRESS.chapterStars,
          completedQuestions: parsed?.completedQuestions && typeof parsed.completedQuestions === 'object' ? parsed.completedQuestions : {},
          examHistory: Array.isArray(parsed?.examHistory) ? parsed.examHistory : [],
        };
      } catch (e) {
        console.error('Failed to parse saved user progress:', e);
      }
    }
    return INITIAL_USER_PROGRESS;
  });

  const [selectedSubject, setSelectedSubject] = useState<Subject>('math');
  const [activeTab, setActiveTab] = useState<'adventure' | 'practice'>('adventure');
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [currentQuestionIndexInChapter, setCurrentQuestionIndexInChapter] = useState(0);

  // Dynamic AI generated questions
  const [dynamicQuestions, setDynamicQuestions] = useState<Question[]>([]);

  // Modals visibility
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const [aiCoachActiveQuestion, setAiCoachActiveQuestion] = useState<Question | null>(null);
  const [isMistakesOpen, setIsMistakesOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isWorksheetOpen, setIsWorksheetOpen] = useState(false);
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [isMultiplicationModalOpen, setIsMultiplicationModalOpen] = useState(false);

  // Save progress locally
  useEffect(() => {
    localStorage.setItem('shanghai_math_summer_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Current grade and subject chapters
  const currentGradeChapters = CHAPTERS_DATA.filter(
    (c) => c.grade === userProgress.selectedGrade && (c.subject === selectedSubject || (!c.subject && selectedSubject === 'math'))
  );

  // Current grade and subject questions
  const currentGradeQuestions = [
    ...QUESTIONS_DATABASE.filter((q) => q.grade === userProgress.selectedGrade && (q.subject === selectedSubject || (!q.subject && selectedSubject === 'math'))),
    ...dynamicQuestions.filter((q) => q.grade === userProgress.selectedGrade && (q.subject === selectedSubject || (!q.subject && selectedSubject === 'math'))),
  ];

  const handleGradeChange = (grade: GradeLevel) => {
    setUserProgress((prev) => ({ ...prev, selectedGrade: grade }));
    setActiveChapter(null);
  };

  const handleAnswerSubmit = (
    questionId: string,
    selectedIndex: number,
    isCorrect: boolean
  ) => {
    setUserProgress((prev) => {
      const updatedCompleted = { ...prev.completedQuestions, [questionId]: selectedIndex };
      let newMistakes = [...prev.mistakes];
      let newCoins = prev.goldCoins;
      let newStars = prev.starsCount;

      if (isCorrect) {
        newCoins += 10;
        newStars += 1;
        // Remove from mistakes if present
        newMistakes = newMistakes.filter((id) => id !== questionId);
      } else {
        if (!newMistakes.includes(questionId)) {
          newMistakes.push(questionId);
        }
      }

      return {
        ...prev,
        completedQuestions: updatedCompleted,
        mistakes: newMistakes,
        goldCoins: newCoins,
        starsCount: newStars,
      };
    });
  };

  const handleInsertGeneratedQuestions = (newQs?: Question[]) => {
    if (newQs && newQs.length > 0) {
      setDynamicQuestions((prev) => [...newQs, ...prev]);
    } else {
      // 默认自动批量生成 5 道全新试题
      const batch = generateBatchQuestions(5, userProgress.selectedGrade, selectedSubject);
      setDynamicQuestions((prev) => [...batch, ...prev]);
      
      // 如果当前正处于某关卡内，把题目也实时追加到当前关卡里
      if (activeChapter) {
        setActiveChapter((prevCap) => {
          if (!prevCap) return null;
          return {
            ...prevCap,
            questions: [...prevCap.questions, ...batch]
          };
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-orange-50/20 to-amber-50/30 text-gray-900 font-sans selection:bg-amber-200">
      
      {/* Header */}
      <HeaderNavbar
        userProgress={{ ...userProgress, selectedSubject }}
        selectedSubject={selectedSubject}
        onSubjectChange={(s) => {
          setSelectedSubject(s);
          setUserProgress((prev) => ({ ...prev, selectedSubject: s }));
          setActiveChapter(null);
        }}
        onGradeChange={handleGradeChange}
        onOpenScratchpad={() => setIsScratchpadOpen(true)}
        onOpenMistakes={() => setIsMistakesOpen(true)}
        onOpenAiCoach={() => {
          setAiCoachActiveQuestion(null);
          setIsAiCoachOpen(true);
        }}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenWorksheet={() => setIsWorksheetOpen(true)}
        onOpenExam={() => setIsExamOpen(true)}
        onOpenMultiplicationTable={() => setIsMultiplicationModalOpen(true)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveChapter(null);
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Chapter Solver View */}
        {activeChapter ? (
          <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-amber-100 shadow-2xs">
              <button
                onClick={() => setActiveChapter(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-orange-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                返回闯关地图
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-800">
                  {activeChapter.title} • {activeChapter.subtitle}
                </span>
              </div>
            </div>

            {/* Questions list inside chapter */}
            {activeChapter.questions.length > 0 ? (
              <div className="space-y-4">
                <QuestionCard
                  question={activeChapter.questions[currentQuestionIndexInChapter]}
                  questionIndex={currentQuestionIndexInChapter}
                  totalQuestions={activeChapter.questions.length}
                  onAnswerSubmit={handleAnswerSubmit}
                  onOpenScratchpad={() => setIsScratchpadOpen(true)}
                  onOpenAiCoachForQuestion={(q) => {
                    setAiCoachActiveQuestion(q);
                    setIsAiCoachOpen(true);
                  }}
                  previouslyAnsweredIndex={
                    userProgress.completedQuestions[
                      activeChapter.questions[currentQuestionIndexInChapter].id
                    ]
                  }
                />

                {/* Question navigation inside chapter */}
                <div className="flex items-center justify-between px-2">
                  <button
                    onClick={() =>
                      setCurrentQuestionIndexInChapter(Math.max(0, currentQuestionIndexInChapter - 1))
                    }
                    disabled={currentQuestionIndexInChapter === 0}
                    className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 disabled:opacity-40 font-bold text-xs rounded-xl transition-all shadow-2xs"
                  >
                    ⬅️ 上一题
                  </button>

                  <span className="text-xs font-semibold text-gray-500">
                    进度：{currentQuestionIndexInChapter + 1} / {activeChapter.questions.length}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentQuestionIndexInChapter(
                        Math.min(
                          activeChapter.questions.length - 1,
                          currentQuestionIndexInChapter + 1
                        )
                      )
                    }
                    disabled={
                      currentQuestionIndexInChapter === activeChapter.questions.length - 1
                    }
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl disabled:opacity-40 transition-all shadow-xs"
                  >
                    下一题 ➡️
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-200">
                <p className="text-gray-500 text-sm">此关卡暂无题目。</p>
              </div>
            )}
          </div>
        ) : activeTab === 'adventure' ? (
          <AdventureMap
            chapters={currentGradeChapters}
            userProgress={userProgress}
            onSelectChapter={(chap) => {
              setActiveChapter(chap);
              setCurrentQuestionIndexInChapter(0);
            }}
            onOpenShop={() => setIsShopOpen(true)}
          />
        ) : (
          <DailyPracticeView
            questions={currentGradeQuestions}
            userProgress={userProgress}
            onAnswerSubmit={handleAnswerSubmit}
            onOpenScratchpad={() => setIsScratchpadOpen(true)}
            onOpenAiCoachForQuestion={(q) => {
              setAiCoachActiveQuestion(q);
              setIsAiCoachOpen(true);
            }}
            onGenerateMoreAiQuestions={() => {
              setAiCoachActiveQuestion(null);
              setIsAiCoachOpen(true);
            }}
          />
        )}
      </main>

      {/* Modals */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />

      <AiMathCoachModal
        isOpen={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
        grade={userProgress.selectedGrade}
        activeQuestion={aiCoachActiveQuestion}
        onInsertGeneratedQuestions={handleInsertGeneratedQuestions}
      />

      <MistakeVaultModal
        isOpen={isMistakesOpen}
        onClose={() => setIsMistakesOpen(false)}
        mistakeIds={userProgress.mistakes}
        onRemoveMistake={(qId) => {
          setUserProgress((prev) => ({
            ...prev,
            mistakes: prev.mistakes.filter((id) => id !== qId),
          }));
        }}
        onSolveQuestionInPractice={(q) => {
          setActiveTab('practice');
        }}
      />

      <ShopAndPetModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        userProgress={userProgress}
        onUpdateProgress={setUserProgress}
      />

      <WorksheetExportModal
        isOpen={isWorksheetOpen}
        onClose={() => setIsWorksheetOpen(false)}
        grade={userProgress.selectedGrade}
      />

      <ExamModal
        isOpen={isExamOpen}
        onClose={() => setIsExamOpen(false)}
        selectedGrade={userProgress.selectedGrade}
        onFinishExam={(score, earnedCoins) => {
          setUserProgress((prev) => ({
            ...prev,
            goldCoins: prev.goldCoins + earnedCoins,
          }));
        }}
      />

      <MultiplicationTableModal
        isOpen={isMultiplicationModalOpen}
        onClose={() => setIsMultiplicationModalOpen(false)}
        onRewardCoins={(amount) => {
          setUserProgress((prev) => ({
            ...prev,
            goldCoins: prev.goldCoins + amount,
          }));
        }}
      />
    </div>
  );
}
