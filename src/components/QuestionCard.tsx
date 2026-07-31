import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { VisualDiagram } from './VisualDiagram';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  PenTool, 
  Bot, 
  HelpCircle,
  Zap,
  Target,
  AlertTriangle,
  GraduationCap,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { speechManager } from '../utils/speech';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswerSubmit: (questionId: string, selectedIndex: number, isCorrect: boolean) => void;
  onOpenScratchpad: () => void;
  onOpenAiCoachForQuestion: (question: Question) => void;
  previouslyAnsweredIndex?: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onAnswerSubmit,
  onOpenScratchpad,
  onOpenAiCoachForQuestion,
  previouslyAnsweredIndex,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    previouslyAnsweredIndex !== undefined ? previouslyAnsweredIndex : null
  );
  const [showExplanation, setShowExplanation] = useState(
    previouslyAnsweredIndex !== undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    // 换题时停止朗读
    speechManager.stop();
    setIsReading(false);
  }, [question.id]);

  const handleReadQuestion = () => {
    if (isReading) {
      speechManager.stop();
      setIsReading(false);
      return;
    }

    const lang = question.subject === 'english' ? 'en-US' : 'zh-CN';
    const readText = `${question.title}。${question.subtitle || ''} ${question.expression || ''}`;
    
    setIsReading(true);
    speechManager.speak(readText, lang, () => {
      setIsReading(false);
    });
  };

  const isCorrect = selectedIndex !== null && selectedIndex === question.correctIndex;
  const isAnswered = selectedIndex !== null;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return; // Already answered
    setSelectedIndex(idx);
    setIsSubmitting(true);

    const correct = idx === question.correctIndex;
    if (correct) {
      soundManager.playCorrect();
      soundManager.playCoin();
    } else {
      soundManager.playWrong();
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setShowExplanation(true);
      onAnswerSubmit(question.id, idx, correct);
    }, 300);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden transition-all my-4">
      {/* Question Header Status */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 px-4 sm:px-6 py-3 sm:py-4 border-b border-amber-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="bg-amber-500 text-white font-black text-[11px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-xs">
            第 {questionIndex + 1} / {totalQuestions} 题
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-amber-900 bg-amber-100/80 px-2 sm:px-2.5 py-0.5 rounded-full">
            {question.category === 'calc' ? '🧮 计算巧算' : question.category === 'word' ? '🎒 应用题' : '🧩 逻辑推理'}
          </span>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Read Aloud Button */}
          <button
            onClick={handleReadQuestion}
            className={`flex items-center gap-1 text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-xl border transition-all font-semibold ${
              isReading
                ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
            }`}
            title="语音朗读题目"
          >
            {isReading ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600" />}
            <span className="hidden xs:inline">{isReading ? '停止' : '朗读'}</span>
          </button>

          {/* Scratchpad Button */}
          <button
            onClick={onOpenScratchpad}
            className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-xl border border-emerald-200 transition-all font-semibold"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>草稿箱</span>
          </button>

          {/* AI Tutor Hint */}
          <button
            onClick={() => onOpenAiCoachForQuestion(question)}
            className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-xl border border-indigo-200 transition-all font-semibold"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI提示</span>
          </button>
        </div>
      </div>

      {/* Main Question Content */}
      <div className="p-4 sm:p-8">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
          {question.title}
        </h3>

        {question.subtitle && (
          <p className="mt-2 text-gray-700 text-sm sm:text-base leading-relaxed bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
            {question.subtitle}
          </p>
        )}

        {/* Expression Box if exists */}
        {question.expression && (
          <div className="my-4 p-4 bg-amber-50/60 border-2 border-dashed border-amber-200 rounded-2xl text-center">
            <span className="text-2xl sm:text-3xl font-black text-amber-900 tracking-wider">
              {question.expression}
            </span>
          </div>
        )}

        {/* Visual Diagram if available */}
        {question.diagramType && (
          <VisualDiagram type={question.diagramType} data={question.diagramData} />
        )}

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
          {question.options.map((option, idx) => {
            const isThisSelected = selectedIndex === idx;
            const isThisCorrect = idx === question.correctIndex;

            let buttonStyle = 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-amber-50 hover:border-amber-300';
            let icon = null;

            if (isAnswered) {
              if (isThisCorrect) {
                buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300 font-bold';
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
              } else if (isThisSelected && !isThisCorrect) {
                buttonStyle = 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-200 font-bold';
                icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
              } else {
                buttonStyle = 'bg-gray-50/60 border-gray-200 text-gray-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered || isSubmitting}
                className={`p-4 rounded-2xl border-2 text-left text-sm sm:text-base font-semibold transition-all flex items-center justify-between gap-3 ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isThisCorrect && isAnswered 
                      ? 'bg-emerald-500 text-white'
                      : isThisSelected && !isThisCorrect && isAnswered
                      ? 'bg-rose-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback Banner */}
        {isAnswered && (
          <div className={`mt-6 p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            isCorrect 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 animate-bounce" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                  <HelpCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-base">
                  {isCorrect ? '🎉 太棒啦！完全正确！+10金币 +1星星' : '💪 没关系，看看下面的思维解析吸取经验吧！'}
                </h4>
                <p className="text-xs opacity-90 mt-0.5">
                  正确答案是：<span className="font-extrabold">{question.options[question.correctIndex]}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-white shadow-xs border border-gray-200 hover:bg-gray-50 transition-all shrink-0"
            >
              <span>{showExplanation ? '收起思维解析' : '展开思维解析'}</span>
              {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Detailed Resolution & Mind Breakdown (思维拆解与衔接总结) */}
        {showExplanation && (
          <div className="mt-6 border-t border-amber-100 pt-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-400" />
                详细思维拆解与小助手解析
              </h4>
            </div>

            {/* 1. 考点定位 */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-2.5">
              <Target className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-amber-900 block">【考点定位】</span>
                <span className="text-xs text-amber-800 font-medium">{question.keyPoint}</span>
              </div>
            </div>

            {/* 2. 步骤拆解 */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
              <span className="font-bold text-xs text-gray-700 block mb-2 flex items-center gap-1">
                <Zap className="w-4 h-4 text-orange-500" />
                【解题步骤拆解】
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-gray-800 font-medium">
                {question.steps.map((step, sIdx) => (
                  <li key={sIdx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* 3. 易错提醒 */}
            <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-rose-900 block">【避坑指南 / 易错陷阱提醒】</span>
                <span className="text-xs text-rose-800 font-medium">{question.trapNotice}</span>
              </div>
            </div>

            {/* 4. 巩固旧知与衔接新课 */}
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl flex items-start gap-2.5">
              <GraduationCap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-indigo-900 block">【巩固旧知与衔接新课】</span>
                <span className="text-xs text-indigo-800 font-medium">{question.bridgeTip}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
