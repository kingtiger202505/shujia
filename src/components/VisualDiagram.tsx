import React from 'react';
import { Question } from '../types';

interface VisualDiagramProps {
  type?: Question['diagramType'];
  data?: any;
}

export const VisualDiagram: React.FC<VisualDiagramProps> = ({ type }) => {
  if (!type) return null;

  return (
    <div className="my-3 p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex flex-col items-center justify-center text-gray-800">
      
      {/* 1. Queue Diagram (排队示意图) */}
      {type === 'queue' && (
        <div className="w-full flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            📍 队列视觉思维图
          </div>
          <div className="flex items-center justify-center gap-1.5 flex-wrap my-2 text-xl">
            {/* 8 Front People */}
            <div className="flex gap-1 items-center bg-blue-100/80 border border-blue-200 p-1.5 rounded-xl">
              <span className="text-xs font-bold text-blue-700 mr-1">前面 8人:</span>
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} title={`前第${i+1}人`}>🧒</span>
              ))}
            </div>

            <span className="text-gray-400 font-bold">➡️</span>

            {/* Protagonist Xiao Ming */}
            <div className="flex items-center bg-orange-500 text-white font-bold px-2.5 py-1.5 rounded-xl shadow-xs ring-2 ring-orange-300 animate-bounce">
              <span className="mr-1">⭐</span>
              <span className="text-xs">小明自己 (1人)</span>
            </div>

            <span className="text-gray-400 font-bold">➡️</span>

            {/* 7 Back People */}
            <div className="flex gap-1 items-center bg-emerald-100/80 border border-emerald-200 p-1.5 rounded-xl">
              <span className="text-xs font-bold text-emerald-700 mr-1">后面 7人:</span>
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} title={`后第${i+1}人`}>👧</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-amber-900 font-medium text-center">
            总人数算式：8（前面） + 1（小明） + 7（后面） = 16人
          </p>
        </div>
      )}

      {/* 2. Clock Diagram (时间时刻图) */}
      {type === 'clock' && (
        <div className="w-full flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            ⏰ 时间演变推导
          </div>
          <div className="flex items-center justify-center gap-4 my-2">
            <div className="flex flex-col items-center bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-2xl">🕗</span>
              <span className="text-xs font-bold text-gray-700 mt-1">开始 8:15</span>
            </div>
            <div className="flex flex-col items-center text-orange-600 font-bold text-xs">
              <span>+ 45分钟</span>
              <span>➡️</span>
            </div>
            <div className="flex flex-col items-center bg-orange-500 text-white p-3 rounded-2xl shadow-sm ring-2 ring-orange-200">
              <span className="text-2xl">🕘</span>
              <span className="text-xs font-bold mt-1">午饭 9:00</span>
            </div>
          </div>
          <p className="text-xs text-amber-900 text-center">
            💡 15分 + 45分 = 60分 = 1小时，8点 + 1小时 = 9点正。
          </p>
        </div>
      )}

      {/* 3. Bar Model Diagram (和差线段图) */}
      {type === 'bar' && (
        <div className="w-full max-w-md flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            📊 和差关系线段图
          </div>
          <div className="w-full space-y-3 bg-white p-3 rounded-xl border border-gray-200">
            {/* Xiao Ming Bar */}
            <div className="flex items-center gap-2 text-xs">
              <span className="w-12 font-bold text-gray-700">小明：</span>
              <div className="flex-1 bg-indigo-500 text-white h-7 rounded-lg flex items-center justify-between px-3 font-semibold shadow-xs">
                <span>小红部分</span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">多 16 本</span>
              </div>
            </div>

            {/* Xiao Hong Bar */}
            <div className="flex items-center gap-2 text-xs">
              <span className="w-12 font-bold text-gray-700">小红：</span>
              <div className="w-[65%] bg-pink-500 text-white h-7 rounded-lg flex items-center justify-center font-semibold shadow-xs">
                小红部分
              </div>
            </div>
          </div>
          <p className="text-xs text-amber-900 font-medium">
            💡 两人的书一共 72 本；去掉多出的 16 本后就是 2 个小红的数量。
          </p>
        </div>
      )}

      {/* 4. Shapes Equivalence (等量代换示意) */}
      {type === 'shapes' && (
        <div className="w-full flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            ⚖️ 天平平衡代换示意
          </div>
          <div className="flex flex-col gap-2 w-full max-w-sm text-sm">
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-gray-200">
              <span className="font-bold">1 个 🍎 苹果</span>
              <span className="text-amber-600 font-bold text-xs">平衡等于</span>
              <span className="font-bold">2 个 🍑 桃子</span>
            </div>
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-gray-200">
              <span className="font-bold">1 个 🍑 桃子</span>
              <span className="text-amber-600 font-bold text-xs">平衡等于</span>
              <span className="font-bold">3 颗 🍒 樱桃</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Cycle Diagram (周期规律图) */}
      {type === 'cycle' && (
        <div className="w-full flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            🔄 彩灯周期循环 (T = 5)
          </div>
          <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-gray-200 shadow-xs">
            <span className="px-2 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-bold">1. 🔴红</span>
            <span className="px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-bold">2. 🟡黄</span>
            <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">3. 🔵蓝</span>
            <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">4. 🟢绿</span>
            <span className="px-2 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold">5. 🟣紫</span>
          </div>
          <p className="text-xs text-amber-900">
            以 5 盏为一组不断循环重演，看除以 5 的【余数】是几！
          </p>
        </div>
      )}

      {/* 6. Area Diagram (平移面积图) */}
      {type === 'area' && (
        <div className="w-full flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            📐 图形道路平移缩减法
          </div>
          <div className="flex items-center justify-center gap-4 my-1">
            <div className="relative w-28 h-20 bg-emerald-300 border-2 border-emerald-600 rounded-lg flex items-center justify-center text-[10px] font-bold text-emerald-900">
              {/* Roads cross */}
              <div className="absolute inset-x-0 h-3 bg-gray-200/80 top-8 border-y border-gray-400" />
              <div className="absolute inset-y-0 w-3 bg-gray-200/80 left-12 border-x border-gray-400" />
              <span className="relative z-10 bg-white/80 px-1 rounded">原图形</span>
            </div>

            <span className="text-orange-500 font-bold text-sm">平移道路 ➡️</span>

            <div className="w-24 h-16 bg-emerald-500 text-white border-2 border-emerald-700 rounded-lg flex flex-col items-center justify-center text-xs font-bold shadow-xs">
              <span>(12-2) × (8-2)</span>
              <span className="text-[10px] text-emerald-100">10米 × 6米</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
