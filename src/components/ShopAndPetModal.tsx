import React, { useState, useEffect, useRef } from 'react';
import { UserProgress } from '../types';
import { SHOP_ITEMS, INITIAL_BADGES } from '../data/questionsData';
import {
  X,
  Coins,
  Sparkles,
  ShoppingBag,
  Award,
  Zap,
  HelpCircle,
  Volume2,
  Check,
  Flame,
  Star,
  Gamepad2,
  RotateCcw,
  Trophy,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Play
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';

interface ShopAndPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProgress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

// Helper to determine pet form according to level
const getPetFormDetails = (level: number) => {
  if (level >= 15) {
    return {
      emoji: '🦄',
      title: '🪐 宇宙算力至尊圣兽',
      aura: 'from-amber-400 via-purple-500 to-indigo-600 animate-pulse',
      bgGlow: 'bg-purple-500/20',
      tagline: '数学宇宙终极统治者！算力无极限！',
      slogan: '吾乃至尊神兽，宇宙万题皆在掌握中！',
    };
  } else if (level >= 10) {
    return {
      emoji: '🐉',
      title: '🐉 沪教天穹神龙',
      aura: 'from-amber-500 via-orange-500 to-yellow-400',
      bgGlow: 'bg-amber-500/20',
      tagline: '翱翔九天，通晓全科解题妙法！',
      slogan: '九天雷霆算力爆棚，看谁敢战！',
    };
  } else if (level >= 6) {
    return {
      emoji: '🦁',
      title: '🦁 烈焰算力圣狮',
      aura: 'from-rose-500 via-orange-500 to-amber-500',
      bgGlow: 'bg-rose-500/20',
      tagline: '百战不殆，算力气浪震慑全场！',
      slogan: '吼！来多少难题本圣狮都吃得下！',
    };
  } else if (level >= 3) {
    return {
      emoji: '🦊',
      title: '🦊 九尾逻辑幻狐',
      aura: 'from-indigo-500 via-purple-500 to-pink-500',
      bgGlow: 'bg-indigo-500/20',
      tagline: '灵性大爆发，秒识所有陷阱！',
      slogan: '哼，这道题的陷阱可瞒不过我的九尾！',
    };
  } else {
    return {
      emoji: '🐣',
      title: '🐣 算力萌禽幼崽',
      aura: 'from-emerald-400 via-teal-500 to-cyan-500',
      bgGlow: 'bg-emerald-500/20',
      tagline: '初级算力启蒙，渴望大量算力食物！',
      slogan: '啾啾！主人快做题喂我，我要进化！',
    };
  }
};

// Falling Item Type definition for Minigame
interface FallingItem {
  id: number;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  speed: number;
  type: 'cookie' | 'steak' | 'elixir' | 'drumstick' | 'bomb' | 'clock';
  icon: string;
  exp: number;
  coins: number;
}

export const ShopAndPetModal: React.FC<ShopAndPetModalProps> = ({
  isOpen,
  onClose,
  userProgress,
  onUpdateProgress,
}) => {
  const [activeTab, setActiveTab] = useState<'pet' | 'game' | 'shop' | 'badges'>('pet');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [petSpeech, setPetSpeech] = useState<string | null>(null);
  const [isBouncing, setIsBouncing] = useState(false);

  // Flying feeding particles
  const [flyingParticles, setFlyingParticles] = useState<
    { id: number; icon: string; x: number; y: number }[]
  >([]);

  // Floating text indicators (+50 EXP!, Level Up!)
  const [floatingText, setFloatingText] = useState<
    { id: number; text: string; color: string }[]
  >([]);

  // Evolution Celebration Modal
  const [evolutionData, setEvolutionData] = useState<{
    newLevel: number;
    title: string;
    emoji: string;
  } | null>(null);

  // ================= MINIGAME STATE =================
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [gameTimeLeft, setGameTimeLeft] = useState<number>(25);
  const [petPosX, setPetPosX] = useState<number>(50); // 0% to 100%
  const [scoreExp, setScoreExp] = useState<number>(0);
  const [scoreCoins, setScoreCoins] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [hitFeedback, setHitFeedback] = useState<string | null>(null);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastSpawnTimeRef = useRef<number>(0);

  if (!isOpen) return null;

  const currentPetForm = getPetFormDetails(userProgress.petLevel);

  // Handle clicking on pet for interactive reaction
  const handlePetClick = () => {
    setIsBouncing(true);
    soundManager.playStar();
    setTimeout(() => setIsBouncing(false), 800);

    const interactiveQuotes = [
      currentPetForm.slogan,
      '💖 摸摸神兽头，做题不用愁！',
      '⚡ 算力已充盈 100%，快去【接美食小游戏】大饱一顿！',
      '🍖 好饿呀！快带我去玩【神兽大胃王接美食】小游戏！',
      '🌟 只要每天坚持答题，我就能进化成天穹神龙！',
    ];
    const randomQuote = interactiveQuotes[Math.floor(Math.random() * interactiveQuotes.length)];
    setPetSpeech(randomQuote);

    // Floating heart effect
    const newId = Date.now();
    setFloatingText((prev) => [...prev, { id: newId, text: '💖 算力亲密度 +10', color: 'text-rose-500' }]);
    setTimeout(() => {
      setFloatingText((prev) => prev.filter((item) => item.id !== newId));
    }, 1500);
  };

  // ================= START MINIGAME LOGIC =================
  const handleStartGame = () => {
    // Check entry fee if needed (e.g. 15 gold)
    const ENTRY_FEE = 15;
    if (userProgress.goldCoins < ENTRY_FEE) {
      soundManager.playWrong();
      setPetSpeech(`🪙 金币不够开启游戏啦！开启需 ${ENTRY_FEE} 金币，快去做题挣金币吧！`);
      return;
    }

    // Deduct entry fee
    onUpdateProgress((prev) => ({
      ...prev,
      goldCoins: Math.max(0, prev.goldCoins - ENTRY_FEE),
    }));

    soundManager.playCoin();

    // Reset Minigame stats
    setGameState('playing');
    setGameTimeLeft(25);
    setPetPosX(50);
    setScoreExp(0);
    setScoreCoins(0);
    setCombo(0);
    setMaxCombo(0);
    setFallingItems([]);
    setHitFeedback(null);
    lastSpawnTimeRef.current = Date.now();
  };

  // Keyboard controls for minigame
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPetPosX((x) => Math.max(8, x - 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPetPosX((x) => Math.min(92, x + 8));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Main game loop (Timer & Animation frame)
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Countdown Timer
    const timerInterval = setInterval(() => {
      setGameTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(timerInterval);
          setGameState('ended');
          soundManager.playStar();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameState]);

  // Animation Frame for Spawning and Falling items
  useEffect(() => {
    if (gameState !== 'playing') return;

    const updateGame = () => {
      const now = Date.now();

      // Spawn new items every 0.6 seconds
      if (now - lastSpawnTimeRef.current > 600) {
        lastSpawnTimeRef.current = now;

        const rand = Math.random();
        let newItem: FallingItem;
        const xPos = Math.floor(Math.random() * 84) + 8; // 8% - 92%

        if (rand < 0.40) {
          newItem = { id: now + Math.random(), x: xPos, y: 0, speed: 1.2, type: 'cookie', icon: '🍪', exp: 10, coins: 3 };
        } else if (rand < 0.65) {
          newItem = { id: now + Math.random(), x: xPos, y: 0, speed: 1.4, type: 'drumstick', icon: '🍗', exp: 18, coins: 5 };
        } else if (rand < 0.82) {
          newItem = { id: now + Math.random(), x: xPos, y: 0, speed: 1.6, type: 'steak', icon: '🥩', exp: 30, coins: 8 };
        } else if (rand < 0.90) {
          newItem = { id: now + Math.random(), x: xPos, y: 0, speed: 1.8, type: 'elixir', icon: '🌟', exp: 60, coins: 15 };
        } else if (rand < 0.95) {
          newItem = { id: now + Math.random(), x: xPos, y: 0, speed: 1.5, type: 'clock', icon: '⏰', exp: 5, coins: 0 };
        } else {
          // Bomb!
          newItem = { id: now + Math.random(), x: xPos, y: 0, speed: 1.7, type: 'bomb', icon: '💣', exp: -15, coins: 0 };
        }

        setFallingItems((prev) => [...prev, newItem]);
      }

      // Move items down and check collisions
      setFallingItems((prevItems) => {
        const nextItems: FallingItem[] = [];

        for (const item of prevItems) {
          const newY = item.y + item.speed * 1.2;

          // Check collision near bottom (y between 78% and 92%)
          if (newY >= 78 && newY <= 92) {
            const distance = Math.abs(item.x - petPosX);
            if (distance < 12) {
              // CAUGHT IT!
              if (item.type === 'bomb') {
                soundManager.playWrong();
                setHitFeedback('💥 哎呀爆破！炸弹扣除经验！');
                setCombo(0);
                setScoreExp((exp) => Math.max(0, exp + item.exp));
              } else if (item.type === 'clock') {
                soundManager.playCoin();
                setGameTimeLeft((t) => t + 3);
                setHitFeedback('⏰ 额外增加 3 秒时间！');
              } else {
                soundManager.playCoin();
                const comboBonus = Math.floor(combo / 3) * 5;
                const earnedExp = item.exp + comboBonus;
                const earnedCoins = item.coins;

                setScoreExp((e) => e + earnedExp);
                setScoreCoins((c) => c + earnedCoins);

                setCombo((c) => {
                  const nextC = c + 1;
                  setMaxCombo((m) => Math.max(m, nextC));
                  return nextC;
                });

                setHitFeedback(`✨ 接中【${item.icon}】！+${earnedExp} EXP`);
              }
              continue; // Remove item after catching
            }
          }

          // If item dropped past bottom
          if (newY > 96) {
            if (item.type !== 'bomb' && item.type !== 'clock') {
              setCombo(0); // Missed food resets combo
            }
            continue;
          }

          nextItems.push({ ...item, y: newY });
        }

        return nextItems;
      });

      animationFrameRef.current = requestAnimationFrame(updateGame);
    };

    animationFrameRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, petPosX, combo]);

  // Handle Game Ended - Apply Rewards To User Progress
  useEffect(() => {
    if (gameState === 'ended' && (scoreExp > 0 || scoreCoins > 0)) {
      onUpdateProgress((prev) => {
        let newPetExp = prev.petExp + scoreExp;
        let newPetLevel = prev.petLevel;
        let newCoins = prev.goldCoins + scoreCoins;

        // Check for level up!
        if (newPetExp >= 100) {
          newPetLevel += Math.floor(newPetExp / 100);
          newPetExp = newPetExp % 100;

          const nextForm = getPetFormDetails(newPetLevel);
          setEvolutionData({
            newLevel: newPetLevel,
            title: nextForm.title,
            emoji: nextForm.emoji,
          });

          newCoins += 50; // Bonus gold on level up!
          soundManager.playStar();
        }

        return {
          ...prev,
          petExp: newPetExp,
          petLevel: newPetLevel,
          goldCoins: newCoins,
        };
      });
    }
  }, [gameState]);

  // Handle Feeding & Purchasing in Shop
  const handleBuyOrFeedItem = (item: (typeof SHOP_ITEMS)[0], e: React.MouseEvent) => {
    if (userProgress.goldCoins < item.cost) {
      soundManager.playWrong();
      setPetSpeech('🪙 呜呜... 金币不够啦！快去【练习考题】做题挣金币吧！');
      return;
    }

    // Trigger feeding particle animation
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const particleId = Date.now();
    setFlyingParticles((prev) => [
      ...prev,
      { id: particleId, icon: item.icon, x: rect.left + rect.width / 2, y: rect.top },
    ]);

    setTimeout(() => {
      setFlyingParticles((prev) => prev.filter((p) => p.id !== particleId));
    }, 1000);

    soundManager.playCoin();

    onUpdateProgress((prev) => {
      let newCoins = prev.goldCoins - item.cost;
      let newPetLevel = prev.petLevel;
      let newPetExp = prev.petExp;
      let newEquippedHat = prev.equippedHat;
      let newOwned = [...(prev.ownedEquipment || [])];

      if (item.type === 'pet_food') {
        const expGain = (item as any).expGain || 50;
        newPetExp += expGain;

        const floatId = Date.now() + 1;
        setFloatingText((f) => [
          ...f,
          { id: floatId, text: `⚡ +${expGain} EXP!`, color: 'text-amber-500 font-black' },
        ]);
        setTimeout(() => {
          setFloatingText((f) => f.filter((item) => item.id !== floatId));
        }, 1500);

        if (newPetExp >= 100) {
          newPetLevel += Math.floor(newPetExp / 100);
          newPetExp = newPetExp % 100;

          const nextForm = getPetFormDetails(newPetLevel);
          setEvolutionData({
            newLevel: newPetLevel,
            title: nextForm.title,
            emoji: nextForm.emoji,
          });

          newCoins += 50;
          soundManager.playStar();
        } else {
          setPetSpeech(`😋 绝美味的【${item.name}】！嚼嚼嚼... 经验暴涨 ${expGain} 点！`);
        }
      } else {
        if (!newOwned.includes(item.id)) {
          newOwned.push(item.id);
        }
        newEquippedHat = item.icon;

        setPetSpeech(`✨ 太帅啦！神兽成功戴上了【${item.name}】！`);
        soundManager.playStar();
      }

      return {
        ...prev,
        goldCoins: newCoins,
        petLevel: newPetLevel,
        petExp: newPetExp,
        equippedHat: newEquippedHat,
        ownedEquipment: newOwned,
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-2 sm:p-6 animate-fadeIn">
      {/* Main Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col h-[92vh] sm:h-[88vh] overflow-hidden border border-amber-200/60 relative">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
              <Gamepad2 className="w-6 h-6 text-yellow-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight flex items-center gap-2">
                沪教算力神兽大殿 & 互动小游戏
                <span className="text-[10px] bg-yellow-300 text-amber-950 font-black px-2 py-0.5 rounded-full shadow-2xs">
                  接美食游戏热玩中
                </span>
              </h3>
              <p className="text-[11px] text-amber-100">玩小游戏接美味，瞬间帮神兽暴击升级！</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Badges */}
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-2xl text-xs font-black border border-white/20">
              <div className="flex items-center gap-1 text-yellow-300">
                <Coins className="w-4 h-4 fill-yellow-300 animate-spin-slow" />
                <span>{userProgress.goldCoins}</span>
              </div>
              <span className="text-white/40">|</span>
              <div className="flex items-center gap-1 text-amber-200">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>{userProgress.starsCount}</span>
              </div>
            </div>

            {/* Help/Guide Button */}
            <button
              onClick={() => setShowGuideModal(true)}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-yellow-100 hover:text-white transition-all border border-white/20"
              title="金币与积分作用说明"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-rose-500 text-white transition-all border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center justify-around bg-amber-50/80 px-2 sm:px-4 py-2 border-b border-amber-100/80 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pet')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'pet'
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'text-amber-900/70 hover:bg-amber-100/60'
            }`}
          >
            <Zap className="w-4 h-4 text-yellow-200 fill-yellow-200" />
            <span>🐾 专属神兽大殿</span>
          </button>

          <button
            onClick={() => setActiveTab('game')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'game'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md scale-105'
                : 'text-purple-900/80 hover:bg-purple-100/60 font-black'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-yellow-300 animate-bounce" />
            <span>🎮 神兽接美食小游戏</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'shop'
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'text-amber-900/70 hover:bg-amber-100/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>🍪 食物与装扮商城</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'badges'
                ? 'bg-indigo-600 text-white shadow-md scale-105'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Award className="w-4 h-4 text-indigo-300" />
            <span>🏆 荣誉勋章殿堂</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gradient-to-b from-amber-50/30 via-slate-50 to-indigo-50/20">

          {/* Floating particle animations overlay */}
          <AnimatePresence>
            {flyingParticles.map((fp) => (
              <motion.div
                key={fp.id}
                initial={{ opacity: 1, scale: 1.5, x: fp.x - 100, y: fp.y - 100 }}
                animate={{ opacity: 0, scale: 0.5, x: 200, y: 150 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="fixed z-50 text-4xl pointer-events-none drop-shadow-xl"
              >
                {fp.icon}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* TAB 1: PET SANCTUARY */}
          {activeTab === 'pet' && (
            <div className="space-y-6">
              
              {/* Pet Shrine Arena */}
              <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden shadow-xl border border-indigo-500/30">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-indigo-500 to-transparent animate-spin-slow pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  
                  {/* Left: Animated Pet Avatar with Halo */}
                  <div className="flex flex-col items-center text-center">
                    <div
                      onClick={handlePetClick}
                      className="relative cursor-pointer group select-none transition-transform active:scale-90"
                    >
                      <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr ${currentPetForm.aura} p-1.5 shadow-2xl transition-all duration-500 group-hover:scale-105`}>
                        <div className="w-full h-full rounded-full bg-slate-950/80 backdrop-blur-md flex items-center justify-center text-6xl sm:text-7xl shadow-inner relative overflow-visible">
                          
                          <motion.span
                            animate={isBouncing ? { y: [-15, 0, -10, 0], scale: [1, 1.25, 0.95, 1] } : { y: [-4, 4, -4] }}
                            transition={isBouncing ? { duration: 0.8 } : { repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                            className="drop-shadow-[0_10px_20px_rgba(255,200,0,0.4)]"
                          >
                            {currentPetForm.emoji}
                          </motion.span>

                          {userProgress.equippedHat && (
                            <motion.span
                              animate={{ rotate: [-8, 8, -8] }}
                              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                              className="absolute -top-4 -right-2 text-3xl sm:text-4xl drop-shadow-lg"
                            >
                              {userProgress.equippedHat}
                            </motion.span>
                          )}
                        </div>
                      </div>

                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded-full shadow-xs group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                        点击神兽互动 💖
                      </span>

                      <AnimatePresence>
                        {floatingText.map((ft) => (
                          <motion.div
                            key={ft.id}
                            initial={{ opacity: 1, y: 0, scale: 0.8 }}
                            animate={{ opacity: 0, y: -50, scale: 1.3 }}
                            transition={{ duration: 1.2 }}
                            className={`absolute top-0 right-0 font-extrabold text-sm sm:text-base ${ft.color} drop-shadow-md pointer-events-none whitespace-nowrap`}
                          >
                            {ft.text}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Middle: Pet Status & Progress */}
                  <div className="flex-1 space-y-3.5 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-md">
                        Lv.{userProgress.petLevel}
                      </span>
                      <h4 className="font-black text-xl sm:text-2xl text-white tracking-wide">
                        {currentPetForm.title}
                      </h4>
                    </div>

                    <p className="text-xs text-indigo-200/90 font-medium leading-relaxed max-w-md">
                      {currentPetForm.tagline}
                    </p>

                    <div className="bg-indigo-900/60 border border-indigo-400/30 p-3 rounded-2xl text-xs text-amber-200 font-bold flex items-start gap-2 max-w-md shadow-inner">
                      <Volume2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
                      <span>{petSpeech || currentPetForm.slogan}</span>
                    </div>

                    <div className="space-y-1.5 max-w-md">
                      <div className="flex justify-between text-xs font-black text-indigo-200">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          神兽算力经验进度
                        </span>
                        <span className="text-yellow-300 font-mono">{userProgress.petExp} / 100 EXP</span>
                      </div>
                      <div className="w-full bg-slate-800/90 h-3.5 rounded-full p-0.5 border border-indigo-500/30 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 h-full rounded-full shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(userProgress.petExp, 100)}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Fast Minigame Banner Prompt */}
              <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-purple-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 shadow-inner border border-white/30">
                    🎮
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-yellow-300">
                      觉得简单投喂不够爽？快来玩【接美食小游戏】！
                    </h4>
                    <p className="text-xs text-purple-100 mt-0.5">
                      左右移动神兽接天空掉落的美食，连击暴击经验与额外金币奖励！
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('game');
                  }}
                  className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-1.5"
                >
                  <Gamepad2 className="w-4 h-4 fill-purple-950" />
                  <span>🎮 立即开启小游戏</span>
                </button>
              </div>

              {/* Quick Feeding items */}
              <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h4 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                    便捷投喂口粮包
                  </h4>
                  <span className="text-xs text-gray-500 font-bold">
                    做题得金币，一键投喂神兽！
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {SHOP_ITEMS.filter((i) => i.type === 'pet_food').map((food) => (
                    <div
                      key={food.id}
                      className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 p-4 rounded-2xl border border-amber-200/80 flex flex-col justify-between gap-3 hover:border-amber-400 transition-all shadow-2xs hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2.5 bg-white rounded-2xl shadow-xs border border-amber-100 shrink-0">
                          {food.icon}
                        </span>
                        <div>
                          <h5 className="font-extrabold text-gray-900 text-sm">{food.name}</h5>
                          <p className="text-[11px] text-amber-800/80 font-medium mt-0.5">
                            {food.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleBuyOrFeedItem(food, e)}
                        className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <span>投喂 (</span>
                        <Coins className="w-3.5 h-3.5 fill-yellow-200 text-yellow-200" />
                        <span>{food.cost} 金币)</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MINIGAME (神兽大胃王接美食小游戏) */}
          {activeTab === 'game' && (
            <div className="space-y-4">
              
              {/* Game Container */}
              <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 border-2 border-indigo-500/40 shadow-2xl relative overflow-hidden min-h-[420px] flex flex-col justify-between text-white">
                
                {/* Background Stars Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

                {/* IDLE SCREEN (START GAME) */}
                {gameState === 'idle' && (
                  <div className="relative z-10 my-auto text-center space-y-5 py-8 max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-500 mx-auto flex items-center justify-center text-5xl shadow-xl animate-bounce border border-purple-300/40">
                      {currentPetForm.emoji}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-yellow-300">
                        神兽大胃王：接美食小游戏
                      </h3>
                      <p className="text-xs text-indigo-200 leading-relaxed font-medium">
                        玩法：天空会掉落各种美食（饼干🍪、牛排🥩、仙丹🌟）。
                        <br />
                        用键盘方向键 ⬅️ ➡️ 或触屏滑动拖拽控制神兽左右接住！小心炸弹💣！
                      </p>
                    </div>

                    <div className="bg-indigo-950/80 p-3.5 rounded-2xl border border-indigo-500/30 text-xs text-amber-300 font-bold flex items-center justify-between">
                      <span>单次入场费：15 学习金币 🪙</span>
                      <span>连击奖励：Combo 叠加翻倍！</span>
                    </div>

                    <button
                      onClick={handleStartGame}
                      className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5 fill-slate-950" />
                      <span>消耗 15 金币 开启 25秒 游戏！</span>
                    </button>
                  </div>
                )}

                {/* PLAYING SCREEN (ACTIVE MINIGAME) */}
                {gameState === 'playing' && (
                  <div
                    ref={gameAreaRef}
                    className="relative z-10 w-full h-[380px] sm:h-[420px] select-none touch-none overflow-hidden"
                    onMouseMove={(e) => {
                      if (!gameAreaRef.current) return;
                      const rect = gameAreaRef.current.getBoundingClientRect();
                      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
                      setPetPosX(Math.min(92, Math.max(8, xPercent)));
                    }}
                    onTouchMove={(e) => {
                      if (!gameAreaRef.current || e.touches.length === 0) return;
                      const rect = gameAreaRef.current.getBoundingClientRect();
                      const touchX = e.touches[0].clientX;
                      const xPercent = ((touchX - rect.left) / rect.width) * 100;
                      setPetPosX(Math.min(92, Math.max(8, xPercent)));
                    }}
                  >
                    {/* Top HUD Stats Bar */}
                    <div className="flex items-center justify-between bg-slate-900/90 border border-indigo-500/30 px-4 py-2 rounded-2xl text-xs font-black shadow-md">
                      <div className="flex items-center gap-2 text-yellow-300">
                        <Zap className="w-4 h-4 fill-yellow-300" />
                        <span>算力EXP: +{scoreExp}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-rose-400 font-black text-sm bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/30 animate-pulse">
                        <span>⏰ {gameTimeLeft}s</span>
                      </div>

                      <div className="flex items-center gap-2 text-amber-300">
                        <Coins className="w-4 h-4 fill-amber-300" />
                        <span>获赠金币: +{scoreCoins}</span>
                      </div>
                    </div>

                    {/* Combo & Hit Feedback Float */}
                    <div className="absolute top-14 left-4 right-4 flex items-center justify-between pointer-events-none">
                      {combo > 1 && (
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black shadow-lg animate-bounce">
                          🔥 COMBO x{combo}!
                        </span>
                      )}
                      {hitFeedback && (
                        <span className="text-[11px] font-bold text-indigo-200 bg-slate-900/80 px-2.5 py-1 rounded-full ml-auto">
                          {hitFeedback}
                        </span>
                      )}
                    </div>

                    {/* Falling Items */}
                    {fallingItems.map((item) => (
                      <div
                        key={item.id}
                        className="absolute text-3xl sm:text-4xl pointer-events-none transition-transform drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                        style={{
                          left: `${item.x}%`,
                          top: `${item.y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        {item.icon}
                      </div>
                    ))}

                    {/* Catching Pet Basket at bottom */}
                    <div
                      className="absolute bottom-2 transition-all duration-75 pointer-events-none"
                      style={{
                        left: `${petPosX}%`,
                        transform: 'translateX(-50%)',
                      }}
                    >
                      <div className="relative flex flex-col items-center">
                        <span className="text-5xl sm:text-6xl drop-shadow-[0_8px_16px_rgba(255,200,0,0.5)]">
                          {currentPetForm.emoji}
                        </span>
                        <div className="w-20 sm:w-24 h-3 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow-lg border border-yellow-200 text-[9px] text-slate-950 font-black text-center leading-3">
                          🥣 算力收集大碗
                        </div>
                      </div>
                    </div>

                    {/* Touch Mobile Controls overlay hints */}
                    <div className="absolute bottom-1 left-2 right-2 flex justify-between pointer-events-auto md:hidden opacity-70">
                      <button
                        onClick={() => setPetPosX((x) => Math.max(8, x - 15))}
                        className="p-3 bg-indigo-600/60 rounded-2xl text-white font-bold text-xs"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setPetPosX((x) => Math.min(92, x + 15))}
                        className="p-3 bg-indigo-600/60 rounded-2xl text-white font-bold text-xs"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                )}

                {/* GAME ENDED SCREEN */}
                {gameState === 'ended' && (
                  <div className="relative z-10 my-auto text-center space-y-5 py-6 max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-full bg-amber-500 mx-auto flex items-center justify-center text-4xl shadow-xl animate-bounce">
                      🏆
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-yellow-300">
                        时间到！小游戏大丰收！
                      </h3>
                      <p className="text-xs text-indigo-200">
                        神兽吃饱喝足，算力狂飙！
                      </p>
                    </div>

                    {/* Stats Result Box */}
                    <div className="bg-indigo-950/90 p-4 rounded-2xl border border-indigo-400/30 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <span className="text-[10px] text-indigo-300 font-bold block">获得的经验</span>
                        <span className="text-lg font-black text-yellow-400">+{scoreExp} EXP</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-300 font-bold block">最大连击</span>
                        <span className="text-lg font-black text-orange-400">{maxCombo} x</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-300 font-bold block">获得的金币</span>
                        <span className="text-lg font-black text-amber-300">+{scoreCoins} 🪙</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setActiveTab('pet')}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
                      >
                        返回神兽大殿
                      </button>
                      <button
                        onClick={handleStartGame}
                        className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>再玩一局 (15金币)</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 3: SHOP ITEMS */}
          {activeTab === 'shop' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-md space-y-4">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <h4 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    神兽酷炫挂饰与装扮
                  </h4>
                  <span className="text-xs text-gray-500 font-bold">
                    已装备：{userProgress.equippedHat || '无'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SHOP_ITEMS.map((item) => {
                    const isOwned = (userProgress.ownedEquipment || []).includes(item.id);
                    const isEquipped = userProgress.equippedHat === item.icon;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isEquipped
                            ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-2.5 bg-slate-50 rounded-2xl border border-gray-200">
                            {item.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-extrabold text-gray-900 text-sm">{item.name}</h5>
                              {isEquipped && (
                                <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                  佩戴中
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleBuyOrFeedItem(item, e)}
                          className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-1 ${
                            isOwned && item.type !== 'pet_food'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-95'
                          }`}
                        >
                          {isOwned && item.type !== 'pet_food' ? (
                            isEquipped ? '重新佩戴' : '一键换装'
                          ) : (
                            <>
                              <Coins className="w-3.5 h-3.5 fill-current" />
                              <span>{item.cost} 金币</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BADGES */}
          {activeTab === 'badges' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-md space-y-4">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <h4 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    沪教暑期数学最高勋章库
                  </h4>
                  <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                    累计得分星数：{userProgress.starsCount} ⭐
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {INITIAL_BADGES.map((b) => {
                    const unlocked = userProgress.starsCount >= 5;

                    return (
                      <div
                        key={b.id}
                        className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                          unlocked
                            ? 'bg-gradient-to-b from-indigo-50/50 to-white border-indigo-200 shadow-sm'
                            : 'bg-gray-100 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white mx-auto flex items-center justify-center text-3xl shadow-xs border border-gray-100">
                          {b.icon}
                        </div>
                        <div>
                          <h6 className="font-extrabold text-gray-900 text-xs">{b.title}</h6>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{b.description}</p>
                        </div>
                        <span
                          className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${
                            unlocked
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {unlocked ? '✨ 已斩获' : '🔒 积分不足解锁'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-white border-t border-gray-200 flex justify-between items-center text-xs text-gray-500 shrink-0">
          <span className="hidden sm:inline font-medium">💡 做题攒金币，玩小游戏爽快升级神兽！</span>
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-5 py-2 rounded-xl transition-all shadow-xs ml-auto"
          >
            关闭大殿
          </button>
        </div>

      </div>

      {/* SUB-MODAL 1: POINTS & GOLD RULES GUIDE */}
      {showGuideModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-amber-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Coins className="w-5 h-5 fill-amber-500" />
                </div>
                <h3 className="font-black text-gray-900 text-base">金币与积分作用指南</h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 font-extrabold text-amber-900 text-sm">
                  <Coins className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>🪙 学习金币（Gold Coins）</span>
                </div>
                <p className="text-amber-800 leading-relaxed font-medium">
                  • <strong>如何获取</strong>：在【练习】或【关卡】中每答对 1 题获得 10~20 金币！
                  <br />
                  • <strong>核心作用</strong>：用于开启【神兽接美食小游戏】或购买食物、魔法帽翅膀装扮神兽！
                </p>
              </div>

              <div className="bg-indigo-50 p-3.5 rounded-2xl border border-indigo-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 font-extrabold text-indigo-900 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>⭐ 关卡星星与积分（Stars & Score）</span>
                </div>
                <p className="text-indigo-800 leading-relaxed font-medium">
                  • <strong>如何获取</strong>：通关章节关卡获得 1~3 颗积分星！
                  <br />
                  • <strong>核心作用</strong>：解锁高年级关卡与【成就勋章库】顶级奖章！
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs"
            >
              我知道啦，去玩小游戏！
            </button>
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: EPIC LEVEL-UP & EVOLUTION CELEBRATION */}
      {evolutionData && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 p-1 rounded-3xl max-w-sm w-full shadow-2xl text-center text-white"
          >
            <div className="bg-slate-950 p-6 rounded-[22px] space-y-5 border border-yellow-300/40">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 p-1 shadow-[0_0_30px_rgba(251,191,36,0.8)] animate-bounce">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-5xl">
                  {evolutionData.emoji}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black text-yellow-300 tracking-widest uppercase block animate-pulse">
                  ✨ EVOLUTION CELEBRATION ✨
                </span>
                <h3 className="text-2xl font-black text-white">神兽暴击突破升级！</h3>
                <p className="text-xs text-amber-200 font-bold">
                  晋升为：【Lv.{evolutionData.newLevel} {evolutionData.title}】
                </p>
              </div>

              <div className="bg-amber-950/80 border border-amber-500/40 p-3 rounded-2xl text-xs text-amber-200 space-y-1">
                <p className="font-extrabold text-yellow-300">🎉 升级奖励获赠：</p>
                <p>• 获得 50 额外金币大礼包 🪙</p>
                <p>• 解锁更高形态算力光环 ⚡</p>
              </div>

              <button
                onClick={() => setEvolutionData(null)}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95"
              >
                太棒了！收下奖励继续进阶 🚀
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
