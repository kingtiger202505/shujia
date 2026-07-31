import React, { useState } from 'react';
import { GradeLevel } from '../types';
import { QUESTIONS_DATABASE } from '../data/questionsData';
import { X, Printer, CheckSquare, Download, FileText } from 'lucide-react';

interface WorksheetExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: GradeLevel;
}

export const WorksheetExportModal: React.FC<WorksheetExportModalProps> = ({
  isOpen,
  onClose,
  grade,
}) => {
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'calc' | 'word' | 'logic'>('all');

  if (!isOpen) return null;

  const filteredQuestions = QUESTIONS_DATABASE.filter((q) => {
    if (q.grade !== grade) return false;
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col h-[85vh] overflow-hidden border border-gray-200">
        
        {/* Modal Top Control Bar */}
        <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-bold text-lg">
                上海小学暑期数学作业卷 (Printable Worksheet)
              </h3>
              <p className="text-xs text-gray-300">
                专为家长与孩子设计，支持一键打印纸质作业与详细思维解答！
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAnswers}
                onChange={(e) => setIncludeAnswers(e.target.checked)}
                className="rounded text-amber-500 focus:ring-0"
              />
              附带详细思路答案页
            </label>

            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              打印作业卷
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Printable Worksheet Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-white font-sans text-gray-900 space-y-8" id="printable-worksheet">
          {/* Homework Sheet Header */}
          <div className="text-center border-b-2 border-gray-900 pb-6">
            <h2 className="text-2xl font-black tracking-wide text-gray-900">
              上海小学【{grade === 'g1_to_g2' ? '一升二年级' : '三升四年级'}】暑期数学每日精练卷
            </h2>
            <div className="flex items-center justify-center gap-8 text-xs font-semibold text-gray-600 mt-3">
              <span>姓名：_______________</span>
              <span>日期：____月____日</span>
              <span>用时：______分钟</span>
              <span>成绩：______/100分</span>
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
            <h3 className="font-bold text-sm bg-gray-100 p-2 rounded-lg border-l-4 border-gray-800">
              一、 基础与思维综合大攻坚（共 {filteredQuestions.length} 题）
            </h3>

            <div className="space-y-6">
              {filteredQuestions.map((q, idx) => (
                <div key={q.id} className="text-sm space-y-2 border-b border-gray-100 pb-4">
                  <div className="font-bold flex items-start gap-2">
                    <span className="shrink-0">{idx + 1}.</span>
                    <div>
                      <span>{q.title}</span>
                      {q.subtitle && <p className="font-normal text-xs text-gray-700 mt-0.5">{q.subtitle}</p>}
                    </div>
                  </div>

                  {q.expression && (
                    <div className="font-mono text-base font-bold bg-gray-50 p-2 rounded text-center my-1 border border-gray-200">
                      {q.expression}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="text-gray-800">
                        ({String.fromCharCode(65 + oIdx)}) {opt}
                      </div>
                    ))}
                  </div>

                  {/* Scratch Area Line */}
                  <div className="h-12 border-b border-dashed border-gray-300 flex items-end justify-end text-[10px] text-gray-400">
                    草稿演算区：
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Answer Sheet Section */}
          {includeAnswers && (
            <div className="border-t-4 border-dashed border-gray-300 pt-8 space-y-6 page-break-before">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">
                  【参考答案与思维思路解析】
                </h3>
                <p className="text-xs text-gray-500 mt-1">供家长辅导与孩子自主订正使用</p>
              </div>

              <div className="space-y-4">
                {filteredQuestions.map((q, idx) => (
                  <div key={q.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-1.5">
                    <div className="font-bold text-gray-900 flex justify-between">
                      <span>第 {idx + 1} 题答案：【 {q.options[q.correctIndex]} 】</span>
                      <span className="text-gray-500 font-normal">考点：{q.keyPoint}</span>
                    </div>

                    <div className="text-gray-700 space-y-1">
                      <p className="font-semibold text-gray-800">解题思路：</p>
                      <ul className="list-disc list-inside space-y-0.5 pl-2 text-gray-600">
                        {q.steps.map((st, sI) => (
                          <li key={sI}>{st}</li>
                        ))}
                      </ul>
                      <p className="text-rose-700 font-medium pt-1">⚠️ 易错提醒：{q.trapNotice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
