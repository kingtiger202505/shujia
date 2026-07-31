import React, { useRef, useEffect, useState } from 'react';
import { X, Eraser, RotateCcw, Pen, Grid, Check } from 'lucide-react';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#1e293b'); // Dark Slate
  const [lineWidth, setLineWidth] = useState(3);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match display box
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 20;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col h-[85vh] overflow-hidden border border-gray-100">
        
        {/* Header toolbar */}
        <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base sm:text-lg">
            <Pen className="w-5 h-5" />
            <span>数学演草纸 (数字竖式与草稿画板)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all ${
                showGrid ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-500/50 hover:bg-emerald-500'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              田字格网格
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-emerald-700 transition-all text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Floating Tools Control Panel */}
        <div className="bg-gray-50 border-b border-gray-200 p-2 sm:p-3 flex items-center justify-between gap-2 overflow-x-auto">
          {/* Tools */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTool('pen')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                tool === 'pen' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Pen className="w-3.5 h-3.5" />
              画笔
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                tool === 'eraser' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              橡皮擦
            </button>
            <button
              onClick={clearCanvas}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              清空全屏
            </button>
          </div>

          {/* Color choices & Line thickness */}
          <div className="flex items-center gap-3">
            {/* Color Palette */}
            <div className="flex items-center gap-1.5">
              {['#1e293b', '#2563eb', '#dc2626', '#059669', '#7c3aed'].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setTool('pen');
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    color === c && tool === 'pen' ? 'scale-110 border-emerald-500 shadow-xs' : 'border-white'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Thickness */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
              {[2, 4, 6].map((w) => (
                <button
                  key={w}
                  onClick={() => setLineWidth(w)}
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    lineWidth === w ? 'bg-emerald-100 text-emerald-800' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {w === 2 ? '细' : w === 4 ? '中' : '粗'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Area with Math Grid Background */}
        <div className="relative flex-1 bg-white overflow-hidden cursor-crosshair">
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #000 1px, transparent 1px),
                  linear-gradient(to bottom, #000 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px',
              }}
            />
          )}

          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full touch-none relative z-10"
          />
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 border-t border-gray-200 p-3 flex justify-between items-center text-xs text-gray-500">
          <span>💡 提示：可以用草稿纸列竖式、画线段图或做计算推演</span>
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded-xl transition-all shadow-xs"
          >
            关闭演草纸
          </button>
        </div>
      </div>
    </div>
  );
};
