import React from 'react';
import { Chapter, UserProgress } from '../types';
import { Star, Lock, CheckCircle, Sparkles, ChevronRight, Award, Trophy, Compass } from 'lucide-react';

interface AdventureMapProps {
  chapters: Chapter[];
  userProgress: UserProgress;
  onSelectChapter: (chapter: Chapter) => void;
  onOpenShop: () => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  chapters,
  userProgress,
  onSelectChapter,
  onOpenShop,
}) => {
  const currentGradeLabel = userProgress.selectedGrade === 'g1_to_g2' ? '一升二年级' : '三升四年级';

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Pet & Grade Level Info */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-yellow-100 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>上海沪教版暑期衔接大冒险</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              【{currentGradeLabel}】数学思维闯关地图 🏰
            </h2>
            <p className="text-sm text-amber-100 leading-relaxed">
              攻克巧算神殿、生活应用题大本营与高阶逻辑宝藏，积攒金币解锁学霸装扮与神兽成长！
            </p>
          </div>

          {/* Math Pet Widget */}
          <div 
            onClick={onOpenShop}
            className="cursor-pointer bg-white/15 hover:bg-white/25 transition-all backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 shrink-0 shadow-sm"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-200 to-yellow-100 flex items-center justify-center text-3xl shadow-inner border border-white">
                {userProgress.petLevel >= 3 ? '🐲' : userProgress.petLevel >= 2 ? '🦊' : '🦉'}
              </div>
              {userProgress.equippedHat && (
                <span className="absolute -top-3 -right-2 text-xl drop-shadow-md">
                  {userProgress.equippedHat}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span>{userProgress.petName}</span>
                <span className="bg-yellow-400 text-yellow-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  Lv.{userProgress.petLevel}
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">点击喂养神兽或换装 🍪</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Level Map */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-orange-500" />
            关卡地图 (Chapters)
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            共 {chapters.length} 大核心单元关卡
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {chapters.map((chapter, idx) => {
            const isUnlocked = userProgress.unlockedChapters.includes(chapter.id) || idx === 0;
            const stars = userProgress.chapterStars[chapter.id] || 0;
            const questionCount = chapter.questions.length;

            return (
              <div
                key={chapter.id}
                onClick={() => isUnlocked && onSelectChapter(chapter)}
                className={`relative rounded-3xl p-6 transition-all border-2 flex flex-col justify-between h-full ${
                  isUnlocked
                    ? 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-xl cursor-pointer hover:-translate-y-1'
                    : 'bg-gray-50 border-gray-200 opacity-75'
                }`}
              >
                {/* Level Tag & Stars */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-black px-3 py-1 rounded-full text-white bg-gradient-to-r ${chapter.themeColor} shadow-xs`}>
                      {chapter.title}
                    </span>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= stars ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-900 text-lg mb-1 leading-snug">
                    {chapter.subtitle}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {chapter.description}
                  </p>
                </div>

                {/* Footer Info */}
                <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">
                    包含 {questionCount} 道经典考题
                  </span>

                  {isUnlocked ? (
                    <button className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-all">
                      <span>开始闯关</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
                      <Lock className="w-4 h-4" />
                      <span>未解锁</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
