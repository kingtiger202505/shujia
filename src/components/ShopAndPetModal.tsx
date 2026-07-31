import React from 'react';
import { UserProgress } from '../types';
import { SHOP_ITEMS, INITIAL_BADGES } from '../data/questionsData';
import { X, Coins, Sparkles, ShoppingBag, Award, Heart } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ShopAndPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProgress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const ShopAndPetModal: React.FC<ShopAndPetModalProps> = ({
  isOpen,
  onClose,
  userProgress,
  onUpdateProgress,
}) => {
  if (!isOpen) return null;

  const handleBuyItem = (item: typeof SHOP_ITEMS[0]) => {
    if (userProgress.goldCoins < item.cost) {
      alert('金币不够啦！快去多做几道数学题挣金币吧！🪙');
      return;
    }

    soundManager.playCoin();

    onUpdateProgress((prev) => {
      let newCoins = prev.goldCoins - item.cost;
      let newPetLevel = prev.petLevel;
      let newPetExp = prev.petExp;
      let newEquippedHat = prev.equippedHat;
      let newOwned = [...prev.ownedEquipment];

      if (item.type === 'pet_food') {
        newPetExp += 50;
        if (newPetExp >= 100) {
          newPetLevel += 1;
          newPetExp -= 100;
          soundManager.playStar();
        }
      } else {
        if (!newOwned.includes(item.id)) {
          newOwned.push(item.id);
        }
        newEquippedHat = item.icon;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col h-[88vh] sm:h-[85vh] overflow-hidden border border-amber-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                英雄商店与萌宠小屋
              </h3>
              <p className="text-[11px] sm:text-xs text-amber-100">做题赚金币，喂养专属神兽！</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
              <Coins className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>{userProgress.goldCoins} 金币</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Pet Evolution Area */}
        <div className="bg-amber-50/80 p-6 border-b border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-300 to-yellow-200 flex items-center justify-center text-4xl shadow-md border-2 border-white">
                {userProgress.petLevel >= 3 ? '🐲' : userProgress.petLevel >= 2 ? '🦊' : '🦉'}
              </div>
              {userProgress.equippedHat && (
                <span className="absolute -top-3 -right-2 text-2xl drop-shadow-md animate-bounce">
                  {userProgress.equippedHat}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-900 text-lg">{userProgress.petName}</h4>
                <span className="bg-orange-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                  Lv.{userProgress.petLevel}
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium">
                {userProgress.petLevel >= 3 ? '终极算力圣龙' : userProgress.petLevel >= 2 ? '九尾逻辑灵狐' : '智慧猫头鹰幼崽'}
              </p>
              {/* Exp Bar */}
              <div className="w-44 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${userProgress.petExp}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-right sm:text-left">
            <span className="text-xs text-amber-900 font-bold block mb-1">
              ✨ 神兽升级需要食物喂养！
            </span>
            <p className="text-xs text-amber-700">
              购买“智慧能量饼干”可为神兽增加 50 经验值！
            </p>
          </div>
        </div>

        {/* Shop Items Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          <div>
            <h4 className="font-bold text-gray-900 text-base mb-3 flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-amber-500" />
              热销魔法道具
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SHOP_ITEMS.map((item) => {
                const isOwned = userProgress.ownedEquipment.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-amber-50 rounded-xl border border-amber-100">
                        {item.icon}
                      </span>
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">{item.name}</h5>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyItem(item)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                        isOwned && item.type !== 'pet_food'
                          ? 'bg-gray-100 text-gray-500 cursor-default'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                      }`}
                    >
                      {isOwned && item.type !== 'pet_food' ? (
                        '已拥有'
                      ) : (
                        <>
                          <Coins className="w-3.5 h-3.5 fill-current" />
                          <span>{item.cost}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Section */}
          <div>
            <h4 className="font-bold text-gray-900 text-base mb-3 flex items-center gap-1.5">
              <Award className="w-5 h-5 text-indigo-600" />
              成就勋章库
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INITIAL_BADGES.map((b) => {
                const unlocked = userProgress.starsCount >= 5; // Simplified unlock check or from progress badges

                return (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-2xl border text-center space-y-1 transition-all ${
                      unlocked
                        ? 'bg-white border-indigo-200 shadow-2xs'
                        : 'bg-gray-100 border-gray-200 opacity-60'
                    }`}
                  >
                    <span className="text-3xl block">{b.icon}</span>
                    <h6 className="font-bold text-gray-900 text-xs">{b.title}</h6>
                    <p className="text-[10px] text-gray-500">{b.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <span>💡 保持每日做题习惯，轻松解锁全部神兽进化！</span>
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl transition-all"
          >
            完成逛街
          </button>
        </div>
      </div>
    </div>
  );
};
