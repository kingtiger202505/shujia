import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client lazily/safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API 1: AI Coach Explanation (Math, Chinese, English)
  const handleExplain = async (req: express.Request, res: express.Response) => {
    try {
      const { questionText, answer, userAttempt, grade, subject = 'math', category, promptType } = req.body;
      
      const ai = getAiClient();
      const subjectName = subject === 'chinese' ? '语文' : subject === 'english' ? '英语' : '数学';
      
      let systemPrompt = `你是一位亲切温和、深受上海小学生喜爱的“小沪${subjectName}名师/学霸导师”。
你的目标是给【${grade === 'g1_to_g2' ? '一升二年级' : '三升四年级'}】小朋友解答${subjectName}题目。
要求：
1. 语气生动活泼，充满鼓励，富有亲和力。
2. 解题步骤与思考路径清晰明了，分点拆解。
3. 紧扣上海（沪教版/统编版）教材特点。如果是语文：强调字词辨析、古诗背诵与意境、阅读表达；如果是英语：强调自然拼读、语法词性、日常对话句型与阅读上下文；如果是数学：强调思维巧算、找规律、画图拆解。
4. 语言简单易懂，适合小学生阅读。`;

      let userPrompt = `【学科】：${subjectName}
题目：${questionText}
标准答案：${answer}
${userAttempt ? `小朋友当前的解答/想法：${userAttempt}` : ''}
【分类】：${category}

请提供：
1. 💡 **魔法思考提示**（启发式提问，鼓励孩子自主思考）
2. 🔍 **详细解析与思维拆解**（一步步分析过程）
3. ⚠️ **易错小陷阱**（提醒小朋友哪里容易粗心做错/混淆）
4. 🌟 **学科小妙招/知识衔接**（巩固旧知与衔接新课知识点总结）`;

      if (promptType === 'hint_only') {
        userPrompt = `题目：${questionText}
请给孩子一个【关键思考提示】，不要直接报出最终答案，用启发式的提问指导他找到解题突破口。`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      res.json({ explanation: response.text || '没有生成解答，请稍后重试。' });
    } catch (error: any) {
      console.error('Error generating explanation:', error);
      res.status(500).json({ error: error.message || 'AI导师正在休息，请稍后重试。' });
    }
  };

  app.post('/api/study/explain', handleExplain);
  app.post('/api/math/explain', handleExplain);

  // API 2: Dynamic Question Generator for Math, Chinese, and English
  const handleGenerate = async (req: express.Request, res: express.Response) => {
    try {
      const { grade, subject = 'math', category, count = 3 } = req.body;
      const ai = getAiClient();

      const gradeLabel = grade === 'g1_to_g2' ? '上海小学一升二年级（1升2）' : '上海小学三升四年级（3升4）';
      const subjectLabel = subject === 'chinese' ? '语文' : subject === 'english' ? '英语' : '数学';

      const prompt = `请为${gradeLabel}的孩子生成 ${count} 道符合上海课程标准（统编版/沪教版）的【${subjectLabel}】暑期精练练习题。
一定要包含：详细题目、4个选项（A/B/C/D）、正确答案选项索引（0-3）、考点说明、详细解题步骤/解析、易错点与衔接知识点。

学科要求与考点方向：
【如果是数学】：
- 计算巧算、应用题（行程、和差倍、排队）、逻辑推理（鸡兔同笼、周期问题、图形等）
【如果是语文】：
- 汉字拼音音调、易错字词形近字、近反义词、古诗文赏析（名句填空与意境）、标点符号、段落阅读理解（主旨/细节）
【如果是英语】：
- 核心词汇辨析（名词复数、动词单三/过去时/现在进行时、介词in/on/at/under）、日常情景交际对话（Greeting/Shopping/Weather）、语法时态、小短文阅读理解

请确保题目质量高、富有趣味性与启发性。`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                category: { type: Type.STRING, description: 'e.g. calc, word, logic, chinese_vocab, chinese_reading, english_vocab, english_grammar' },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '4 option strings',
                },
                correctIndex: { type: Type.INTEGER, description: 'Index of correct option 0-3' },
                keyPoint: { type: Type.STRING, description: '考点定位' },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Step by step reasoning points',
                },
                trapNotice: { type: Type.STRING, description: '易错陷阱提醒' },
                bridgeTip: { type: Type.STRING, description: '衔接新课知识点点拨' },
              },
              required: ['title', 'options', 'correctIndex', 'keyPoint', 'steps', 'trapNotice', 'bridgeTip'],
            },
          },
        },
      });

      const rawText = response.text || '[]';
      const questions = JSON.parse(rawText);
      res.json({ questions });
    } catch (error: any) {
      console.error('Error generating dynamic questions:', error);
      res.status(500).json({ error: error.message || 'AI生成题目失败，请稍后重试。' });
    }
  };

  app.post('/api/study/generate', handleGenerate);
  app.post('/api/math/generate', handleGenerate);

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shanghai Math Summer Adventure server running on port ${PORT}`);
  });
}

startServer();
