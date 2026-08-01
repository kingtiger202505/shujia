import React from 'react';
import { GradeLevel, Subject, UserProgress } from '../types';
import { 
  Sparkles, 
  Coins, 
  Star, 
  PenTool, 
  BookOpenCheck, 
  Bot, 
  Award, 
  ShoppingBag, 
  Printer, 
  Volume2, 
  VolumeX,
  Compass,
  Zap,
  FileText
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderNavbarProps {
  userProgress: UserProgress;
  selectedSubject: Subject;
  onSubjectChange: (subject: Subject) => void;
  onGradeChange: (grade: GradeLevel) => void;
  onOpenScratchpad: () => void;
  onOpenMistakes: () => void;
  onOpenAiCoach: () => void;
  onOpenShop: () => void;
  onOpenWorksheet: () => void;
  onOpenExam: () => void;
  onOpenMultiplicationTable?: () => void;
  activeTab: 'adventure' | 'practice';
  onTabChange: (tab: 'adventure' | 'practice') => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  userProgress,
  selectedSubject,
  onSubjectChange,
  onGradeChange,
  onOpenScratchpad,
  onOpenMistakes,
  onOpenAiCoach,
  onOpenShop,
  onOpenWorksheet,
  onOpenExam,
  onOpenMultiplicationTable,
  activeTab,
  onTabChange,
}) => {
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  const toggleSound = () => {
    soundManager.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* App Logo & Grade / Subject Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-orange-200 shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm sm:text-lg leading-tight flex items-center gap-1">
                <span>上海全科暑期闯关</span>
                <span className="hidden xs:inline-block text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                  沪教衔接
                </span>
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                {/* Grade Switcher Pills */}
                <button
                  onClick={() => onGradeChange('g1_to_g2')}
                  className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full transition-all font-semibold ${
                    userProgress.selectedGrade === 'g1_to_g2'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  1升2
                </button>
                <button
                  onClick={() => onGradeChange('g3_to_g4')}
                  className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full transition-all font-semibold ${
                    userProgress.selectedGrade === 'g3_to_g4'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  3升4
                </button>

                {/* Subject Pills for Desktop/Tablet */}
                <div className="h-3 w-px bg-gray-200 my-auto hidden md:block" />
                <div className="hidden md:flex items-center gap-1">
                  {(['math', 'chinese', 'english'] as Subject[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => onSubjectChange(s)}
                      className={`text-[11px] px-2 py-0.5 rounded-md font-bold transition-all ${
                        selectedSubject === s
                          ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {s === 'math' ? '🧮数学' : s === 'chinese' ? '📖语文' : '🔤英语'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Nav Mode Tabs */}
          <div className="hidden md:flex items-center bg-gray-100/80 p-1 rounded-xl text-sm font-medium">
            <button
              onClick={() => onTabChange('adventure')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'adventure'
                  ? 'bg-white text-orange-600 shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              闯关地图
            </button>
            <button
              onClick={() => onTabChange('practice')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'practice'
                  ? 'bg-white text-indigo-600 shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              自由练题
            </button>
          </div>

          {/* Gamified Currency Stats & Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Multiplication Table Button */}
            {onOpenMultiplicationTable && (
              <button
                onClick={onOpenMultiplicationTable}
                className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-105 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-100 shrink-0"
                title="九九乘法口诀特训"
              >
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-100 fill-yellow-100" />
                <span className="hidden xs:inline">乘法口诀</span>
              </button>
            )}

            {/* Exam Modal Button */}
            <button
              onClick={onOpenExam}
              className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-105 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-100 shrink-0"
              title="全科期末模拟测试"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span className="hidden sm:inline">期末考场</span>
            </button>

            {/* Coins */}
            <button 
              onClick={onOpenShop}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs sm:text-sm font-bold transition-all shadow-2xs hover:scale-105"
              title="学习金币：可用于在商店中喂养萌宠、升级、兑换帽子装扮！"
            >
              <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{userProgress.goldCoins} 金币</span>
              <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md hidden md:inline font-normal">去宠物商店 ➔</span>
            </button>

            {/* Stars */}
            <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 text-yellow-900 px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold shadow-2xs">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
              <span>{userProgress.starsCount}</span>
            </div>

            {/* Unified Dynamic Generator Entry Point in Header */}
            <button
              onClick={() => onTabChange('practice')}
              className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0"
              title="沪教衔接一键智能出题中心"
            >
              <Zap className="w-4 h-4 text-indigo-600 animate-pulse fill-indigo-200" />
              <span className="hidden sm:inline">智能出题</span>
            </button>

            {/* Scratchpad (草稿纸) */}
            <button
              onClick={onOpenScratchpad}
              className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs shrink-0"
              title="打开演草纸"
            >
              <PenTool className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">草稿纸</span>
            </button>

            {/* Mistakes Vault */}
            <button
              onClick={onOpenMistakes}
              className="relative flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs"
              title="查看错题集"
            >
              <BookOpenCheck className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">错题本</span>
              {userProgress.mistakes.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {userProgress.mistakes.length}
                </span>
              )}
            </button>

            {/* Printable Homework */}
            <button
              onClick={onOpenWorksheet}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all hidden sm:block"
              title="导出暑期练习卷"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Mute/Sound */}
            <button
              onClick={toggleSound}
              className="p-1.5 text-gray-500 hover:text-gray-800 rounded-xl transition-all"
              title={soundEnabled ? '音效开启' : '音效静音'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            </button>
          </div>

        </div>

        {/* Mobile Nav Switcher & Subject Pills */}
        <div className="flex md:hidden border-t border-gray-100 py-2 items-center justify-between gap-1 text-xs font-medium px-1">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100/80 p-0.5 rounded-xl">
            <button
              onClick={() => onTabChange('adventure')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all text-xs ${
                activeTab === 'adventure' ? 'bg-white text-orange-600 font-bold shadow-xs' : 'text-gray-600'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>地图</span>
            </button>
            <button
              onClick={() => onTabChange('practice')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all text-xs ${
                activeTab === 'practice' ? 'bg-white text-indigo-600 font-bold shadow-xs' : 'text-gray-600'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>刷题</span>
            </button>
          </div>

          {/* Subjects for mobile */}
          <div className="flex items-center gap-1 bg-amber-50/80 p-0.5 rounded-xl border border-amber-200/60">
            {(['math', 'chinese', 'english'] as Subject[]).map((s) => (
              <button
                key={s}
                onClick={() => onSubjectChange(s)}
                className={`text-[11px] px-2 py-1 rounded-lg font-bold transition-all ${
                  selectedSubject === s
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                {s === 'math' ? '数学' : s === 'chinese' ? '语文' : '英语'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
