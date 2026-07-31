import React, { useState } from 'react';
import { GradeLevel, Question } from '../types';
import { Bot, Send, Sparkles, X, Lightbulb, RefreshCw, MessageSquare, BookOpen, Volume2 } from 'lucide-react';
import { speechManager } from '../utils/speech';
import { generateBatchQuestions } from '../utils/questionGenerator';

interface AiMathCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: GradeLevel;
  activeQuestion?: Question | null;
  onInsertGeneratedQuestions?: (questions: Question[]) => void;
}

export const AiMathCoachModal: React.FC<AiMathCoachModalProps> = ({
  isOpen,
  onClose,
  grade,
  activeQuestion,
  onInsertGeneratedQuestions,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `你好啊！我是你的“小沪数学学霸导师” 🐱‍🏍！\n专为上海【${grade === 'g1_to_g2' ? '1升2年级' : '3升4年级'}】小朋友解答数学疑难杂症！\n无论是有题目做不出来，还是想看有趣的启发思路，随时跟我聊聊哦！`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (queryOverride?: string) => {
    const textToSend = queryOverride || inputQuery;
    if (!textToSend.trim() || loading) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: textToSend }];
    setMessages(newMsgs);
    if (!queryOverride) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/math/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: activeQuestion ? activeQuestion.title + ' ' + (activeQuestion.subtitle || '') : textToSend,
          answer: activeQuestion ? activeQuestion.options[activeQuestion.correctIndex] : '',
          userAttempt: textToSend,
          grade,
          category: activeQuestion?.category || 'calc'
        })
      });

      const data = await res.json();
      setMessages([...newMsgs, { sender: 'ai', text: data.explanation || '抱歉，导师刚才溜号啦，请重试一下吧！' }]);
    } catch (e: any) {
      setMessages([...newMsgs, { sender: 'ai', text: '💡 网络连接小晃动，请稍后重试哦！' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAiQuestions = async (category: 'calc' | 'word' | 'logic') => {
    setGeneratingQuiz(true);
    let newQuestions: Question[] = [];
    try {
      const res = await fetch('/api/math/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, category, count: 3 })
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        newQuestions = data.questions;
      } else {
        newQuestions = generateBatchQuestions(3, grade, 'math', category);
      }
    } catch (e) {
      newQuestions = generateBatchQuestions(3, grade, 'math', category);
    } finally {
      if (newQuestions.length > 0 && onInsertGeneratedQuestions) {
        onInsertGeneratedQuestions(newQuestions);
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `✨ 已成功为你现场生成了 3 道上海沪教版特色【${category === 'calc' ? '计算巧算' : category === 'word' ? '应用题' : '逻辑推理'}】新练习题！快去刷题列表中挑战吧！`
          }
        ]);
      }
      setGeneratingQuiz(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col h-[85vh] sm:h-[80vh] overflow-hidden border border-indigo-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Bot className="w-6 h-6 text-yellow-300 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                小沪AI数学学霸导师
                <span className="text-[10px] bg-yellow-400 text-purple-950 font-black px-2 py-0.5 rounded-full">
                  Gemini-3.6 驱动
                </span>
              </h3>
              <p className="text-xs text-indigo-100">上海沪教版思维辅导与实时讲题</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Target Question Context if provided */}
        {activeQuestion && (
          <div className="bg-indigo-50/80 px-4 py-2.5 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
            <div className="flex items-center gap-2 truncate">
              <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-semibold truncate">当前锁定题目：{activeQuestion.title}</span>
            </div>
            <button
              onClick={() => handleSendMessage(`请帮我用生动的比喻讲讲这道题的思路：“${activeQuestion.title}”`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-lg font-bold shrink-0 shadow-2xs"
            >
              💡 拆解这题
            </button>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-white'
                    : 'bg-indigo-600 text-white shadow-sm'
                }`}
              >
                {msg.sender === 'user' ? '👧' : '🐱‍🏍'}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[82%] whitespace-pre-line relative group ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-white font-medium rounded-tr-none'
                    : 'bg-white border border-gray-200 text-gray-800 shadow-2xs rounded-tl-none'
                }`}
              >
                {msg.text}
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => speechManager.speak(msg.text, 'zh-CN')}
                    className="mt-2 text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100"
                    title="语音朗读讲解"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>朗读讲解</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold bg-white p-3 rounded-2xl border border-indigo-100 max-w-xs shadow-2xs">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-500" />
              <span>小沪导师正在思考最生动的解法……</span>
            </div>
          )}
        </div>

        {/* Quick Action Pills */}
        <div className="p-2.5 bg-gray-50 border-t border-gray-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-gray-400 font-bold shrink-0 ml-1">AI出题:</span>
          <button
            onClick={() => handleGenerateAiQuestions('calc')}
            disabled={generatingQuiz}
            className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold shrink-0 transition-all"
          >
            🧮 生成计算巧算新题
          </button>
          <button
            onClick={() => handleGenerateAiQuestions('word')}
            disabled={generatingQuiz}
            className="px-2.5 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold shrink-0 transition-all"
          >
            🎒 生成应用题新题
          </button>
          <button
            onClick={() => handleGenerateAiQuestions('logic')}
            disabled={generatingQuiz}
            className="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold shrink-0 transition-all"
          >
            🧩 生成逻辑推理新题
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="请向AI数学导师提问（例如：凑十法怎么用？这道题为什么不能直接加？）..."
            className="flex-1 bg-gray-100 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputQuery.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-2xl transition-all shadow-xs flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
