import { Question, Subject, GradeLevel, QuestionCategory } from '../types';

// 随机整数 helper (包含 min 和 max)
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 洗牌算法乱序选项
function shuffleOptions<T>(array: T[], correctItem: T): { options: T[]; correctIndex: number } {
  const options = [...array];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  const correctIndex = options.indexOf(correctItem);
  return { options, correctIndex };
}

// 数字转中文汉字（用于乘法口诀，如 1->一, 2->二... 56->五十六）
const CHINESE_NUMS: Record<number, string> = {
  1: '一', 2: '二', 3: '三', 4: '四', 5: '五',
  6: '六', 7: '七', 8: '八', 9: '九', 10: '十',
  12: '十二', 14: '十四', 15: '十五', 16: '十六', 18: '十八',
  20: '二十', 21: '二十一', 24: '二十四', 25: '二十五', 27: '二十七',
  28: '二十八', 30: '三十', 32: '三十二', 35: '三十五', 36: '三十六',
  40: '四十', 42: '四十二', 45: '四十五', 48: '四十八', 49: '四十九',
  54: '五十四', 56: '五十六', 63: '六十三', 64: '六十四', 72: '七十二', 81: '八十一'
};

/**
 * 离线/实时全学科算法生成器：生成无限符合沪教版要求的规范高质量题目
 */
export function generateRandomQuestion(
  grade: GradeLevel = 'g1_to_g2',
  subject: Subject = 'math',
  category?: QuestionCategory
): Question {
  const id = `gen_${Date.now()}_${getRandomInt(1000, 9999)}`;

  // ==========================================
  // 1. 乘法口诀专练 / 九九乘法表 (Math - Multiplication Table)
  // ==========================================
  if (category === 'multiplication_table' || (subject === 'math' && Math.random() < 0.25 && grade === 'g1_to_g2')) {
    const a = getRandomInt(2, 9);
    const b = getRandomInt(2, 9);
    const product = a * b;
    const type = getRandomInt(1, 4);

    if (type === 1) {
      // 标准计算：a × b = ?
      const wrong1 = product + a;
      const wrong2 = product - b;
      const wrong3 = product + (Math.random() < 0.5 ? 2 : -2);
      const { options, correctIndex } = shuffleOptions(
        [`${product}`, `${wrong1}`, `${wrong2}`, `${wrong3}`],
        `${product}`
      );
      return {
        id,
        grade,
        subject: 'math',
        chapterId: 'g1_ch1',
        category: 'multiplication_table',
        title: '【九九乘法口诀】求积速算',
        expression: `${a} × ${b} = ?`,
        options,
        correctIndex,
        keyPoint: `背诵乘法口诀：“${CHINESE_NUMS[Math.min(a, b)]}${CHINESE_NUMS[Math.max(a, b)]}${CHINESE_NUMS[product]}”`,
        steps: [
          `确定乘数分别是 ${a} 和 ${b}。`,
          `回忆口诀“${CHINESE_NUMS[Math.min(a, b)]}${CHINESE_NUMS[Math.max(a, b)]}${CHINESE_NUMS[product]}”。`,
          `得出结果为 ${product}。`
        ],
        trapNotice: '认清乘法口诀，注意积的十位与个位不要颠倒！',
        bridgeTip: '二年级核心速算基石。',
        difficulty: 1
      };
    } else if (type === 2) {
      // 口诀填空，如：“七八（ ）”
      const minVal = Math.min(a, b);
      const maxVal = Math.max(a, b);
      const correctStr = CHINESE_NUMS[product];
      const wrong1Str = CHINESE_NUMS[product + 2] || '五十四';
      const wrong2Str = CHINESE_NUMS[product - 2] || '四十六';
      const wrong3Str = CHINESE_NUMS[product + 10] || '六十六';

      const { options, correctIndex } = shuffleOptions(
        [correctStr, wrong1Str, wrong2Str, wrong3Str],
        correctStr
      );

      return {
        id,
        grade,
        subject: 'math',
        chapterId: 'g1_ch1',
        category: 'multiplication_table',
        title: '【乘法口诀填空】补全口诀',
        subtitle: `乘法口诀“${CHINESE_NUMS[minVal]}${CHINESE_NUMS[maxVal]}（  ）”，括号里应该填什么？`,
        options,
        correctIndex,
        keyPoint: `补全口诀：${CHINESE_NUMS[minVal]}${CHINESE_NUMS[maxVal]}${correctStr}`,
        steps: [
          `对应的两个因数是 ${minVal} 和 ${maxVal}。`,
          `完整口诀为：“${CHINESE_NUMS[minVal]}${CHINESE_NUMS[maxVal]}${correctStr}”。`
        ],
        trapNotice: '口诀记忆要准确，发音清晰无误。',
        bridgeTip: '口诀熟练度特训。',
        difficulty: 1
      };
    } else if (type === 3) {
      // 逆向填空：? × b = product
      const wrong1 = a + 1;
      const wrong2 = a > 2 ? a - 1 : a + 2;
      const wrong3 = a + 3;
      const { options, correctIndex } = shuffleOptions(
        [`${a}`, `${wrong1}`, `${wrong2}`, `${wrong3}`],
        `${a}`
      );

      return {
        id,
        grade,
        subject: 'math',
        chapterId: 'g1_ch1',
        category: 'multiplication_table',
        title: '【乘法逆向思维】求未知因数',
        expression: `(  ) × ${b} = ${product}`,
        options,
        correctIndex,
        keyPoint: `想想几乘以 ${b} 等于 ${product}，运用 ${b} 的乘法口诀`,
        steps: [
          `看乘数 ${b} 和积 ${product}。`,
          `想口诀：“${CHINESE_NUMS[Math.min(a, b)]}${CHINESE_NUMS[Math.max(a, b)]}${CHINESE_NUMS[product]}”。`,
          `得出未知因数为 ${a}。`
        ],
        trapNotice: '逆向推算因数时，也可利用除法 ${product} ÷ ${b} 验算。',
        bridgeTip: '为表内除法打下扎实基础。',
        difficulty: 2
      };
    } else {
      // 表内除法应用： product ÷ a = ?
      const ans = b;
      const wrong1 = ans + 1;
      const wrong2 = ans - 1 > 0 ? ans - 1 : ans + 2;
      const wrong3 = ans + 2;
      const { options, correctIndex } = shuffleOptions(
        [`${ans}`, `${wrong1}`, `${wrong2}`, `${wrong3}`],
        `${ans}`
      );

      return {
        id,
        grade,
        subject: 'math',
        chapterId: 'g1_ch1',
        category: 'multiplication_table',
        title: '【乘法口诀求商】表内除法',
        expression: `${product} ÷ ${a} = ?`,
        options,
        correctIndex,
        keyPoint: `用乘法口诀“${CHINESE_NUMS[Math.min(a, b)]}${CHINESE_NUMS[Math.max(a, b)]}${CHINESE_NUMS[product]}”求商`,
        steps: [
          `想：想 ${a} 的乘法口诀，谁与 ${a} 相乘得 ${product}。`,
          `根据口诀得知 ${a} × ${b} = ${product}。`,
          `所以 ${product} ÷ ${a} = ${b}。`
        ],
        trapNotice: '除法是乘法的逆运算，用同一句乘法口诀即可轻松解决！',
        bridgeTip: '二年级乘除法互逆关系。',
        difficulty: 2
      };
    }
  }

  // ==========================================
  // 2. 数学常规题型 (Math - General)
  // ==========================================
  if (subject === 'math') {
    const cat = category || (['calc', 'word', 'logic'] as QuestionCategory[])[getRandomInt(0, 2)];

    if (grade === 'g1_to_g2') {
      if (cat === 'calc') {
        const type = getRandomInt(1, 3);
        if (type === 1) {
          // 凑十法连加，如 24 + 18 + 26
          const a1 = getRandomInt(1, 4) * 10 + 4;
          const a2 = getRandomInt(1, 3) * 10 + getRandomInt(1, 9);
          const a3 = getRandomInt(1, 3) * 10 + 6;
          const sum = a1 + a2 + a3;
          const wrong1 = sum + 10;
          const wrong2 = sum - 10;
          const wrong3 = sum - 2;
          const { options, correctIndex } = shuffleOptions([`${sum}`, `${wrong1}`, `${wrong2}`, `${wrong3}`], `${sum}`);

          return {
            id,
            grade,
            subject: 'math',
            chapterId: 'g1_ch1',
            category: 'calc',
            title: `【巧算连加】加法结合律`,
            expression: `${a1} + ${a2} + ${a3} = ?`,
            options,
            correctIndex,
            keyPoint: '利用 4 + 6 = 10 凑成整十数先计算',
            steps: [
              `观察算式中 ${a1} 的个位是 4，${a3} 的个位是 6。`,
              `把 ${a1} 与 ${a3} 结合先算：${a1} + ${a3} = ${a1 + a3}。`,
              `再加上 ${a2}：${a1 + a3} + ${a2} = ${sum}。`
            ],
            trapNotice: '认准 4与6、3与7、2与8 的凑十组合，先凑整再相加！',
            bridgeTip: '二年级核心速算技能。',
            difficulty: 1
          };
        } else {
          // 两位数退位减法巧算，如 83 - 39
          const ten = getRandomInt(6, 9) * 10;
          const sub = getRandomInt(2, 5) * 10 + 9;
          const base = ten + getRandomInt(1, 4);
          const ans = base - sub;
          const nearTen = sub + 1;
          const { options, correctIndex } = shuffleOptions(
            [`${ans}`, `${ans - 2}`, `${ans + 10}`, `${ans + 2}`],
            `${ans}`
          );

          return {
            id,
            grade,
            subject: 'math',
            chapterId: 'g1_ch1',
            category: 'calc',
            title: `【巧算减法】多减要加回`,
            expression: `${base} - ${sub} = ?`,
            options,
            correctIndex,
            keyPoint: `把 ${sub} 看作 ${nearTen}，多减了 1，最后要加上 1`,
            steps: [
              `把接近整十数的 ${sub} 看作 ${nearTen}。`,
              `先算 ${base} - ${nearTen} = ${base - nearTen}。`,
              `因为多减了 1，所以要加回 1：${base - nearTen} + 1 = ${ans}。`
            ],
            trapNotice: '记住多减了要加回，少减了要再减！',
            bridgeTip: '锻炼思维灵活性。',
            difficulty: 2
          };
        }
      } else if (cat === 'word') {
        const numCuts = getRandomInt(2, 6);
        const segments = numCuts + 1;
        const { options, correctIndex } = shuffleOptions(
          [`${segments} 段`, `${numCuts} 段`, `${numCuts + 2} 段`, `${numCuts - 1} 段`],
          `${segments} 段`
        );

        return {
          id,
          grade,
          subject: 'math',
          chapterId: 'g1_ch2',
          category: 'word',
          title: '【间隔问题】剪彩带问题',
          subtitle: `小明把一根彩带剪了 ${numCuts} 刀，彩带被剪成了多少段？`,
          options,
          correctIndex,
          keyPoint: '段数 = 剪的次数 + 1',
          steps: [
            `剪 1 刀变成 2 段，剪 2 刀变成 3 段……`,
            `剪 ${numCuts} 刀，得到的段数是 ${numCuts} + 1 = ${segments} 段。`
          ],
          trapNotice: '不要直接把次数当作段数！',
          bridgeTip: '二年级植树模型萌芽。',
          difficulty: 2
        };
      } else {
        const before = getRandomInt(3, 8);
        const after = getRandomInt(4, 9);
        const total = before + after + 1;
        const { options, correctIndex } = shuffleOptions(
          [`${total} 人`, `${before + after} 人`, `${total + 1} 人`, `${total - 2} 人`],
          `${total} 人`
        );

        return {
          id,
          grade,
          subject: 'math',
          chapterId: 'g1_ch3',
          category: 'logic',
          title: '【排队逻辑】求队伍总人数',
          subtitle: `小朋友们排成一队做操，小红的前面有 ${before} 个人，后面有 ${after} 个人。这队一共有多少人？`,
          options,
          correctIndex,
          keyPoint: '总人数 = 前面的人数 + 后面的人数 + 小红自己(1人)',
          steps: [
            `前面有 ${before} 人，后面有 ${after} 人。`,
            `算总人数时千万不要遗漏小红自己！`,
            `计算算式：${before} + ${after} + 1 = ${total} 人。`
          ],
          trapNotice: '最容易遗漏小红本人，别忘了 + 1！',
          bridgeTip: '排队计数逻辑基石。',
          difficulty: 1
        };
      }
    } else {
      // 3升4年级 数学
      if (cat === 'calc') {
        const factor = getRandomInt(2, 9);
        const mult = 125 * factor * 8;
        const subMult = 125 * factor;
        const ans = mult - subMult;
        const exprStr = `125 × ${factor * 8 - 1}`;
        const { options, correctIndex } = shuffleOptions(
          [`${ans}`, `${ans + 100}`, `${ans - 125}`, `${mult}`],
          `${ans}`
        );

        return {
          id,
          grade,
          subject: 'math',
          chapterId: 'g3_ch1',
          category: 'calc',
          title: '【乘法分配律】拆数简算',
          expression: `${exprStr} = ?`,
          options,
          correctIndex,
          keyPoint: `125 × (${factor * 8} - 1) = 125 × ${factor * 8} - 125 × 1`,
          steps: [
            `把接近整百整十的数拆开。`,
            `125 × ${factor * 8} = ${mult}。`,
            `${mult} - 125 = ${ans}。`
          ],
          trapNotice: '乘法分配律展开时注意括号内的减号。',
          bridgeTip: '四年级上册简便计算重点。',
          difficulty: 3
        };
      } else if (cat === 'word') {
        const times = getRandomInt(3, 5);
        const childPrice = getRandomInt(15, 35) * 2;
        const diff = childPrice * (times - 1);
        const adultPrice = childPrice * times;
        const { options, correctIndex } = shuffleOptions(
          [
            `成人票 ${adultPrice} 元，儿童票 ${childPrice} 元`,
            `成人票 ${adultPrice + 20} 元，儿童票 ${childPrice - 10} 元`,
            `成人票 ${adultPrice - 30} 元，儿童票 ${childPrice} 元`,
            `成人票 ${diff} 元，儿童票 ${childPrice} 元`
          ],
          `成人票 ${adultPrice} 元，儿童票 ${childPrice} 元`
        );

        return {
          id,
          grade,
          subject: 'math',
          chapterId: 'g3_ch2',
          category: 'word',
          title: '【差倍问题】门票价格计算',
          subtitle: `公园成人票价格是儿童票的 ${times} 倍，一张成人票比一张儿童票贵 ${diff} 元。成人票和儿童票各多少钱？`,
          options,
          correctIndex,
          keyPoint: '儿童票(1倍量) = 差额 ÷ (倍数 - 1)',
          steps: [
            `成人票比儿童票多 ${times - 1} 份。`,
            `这 ${times - 1} 份对应的金额是 ${diff} 元。`,
            `儿童票：${diff} ÷ ${times - 1} = ${childPrice} 元。`,
            `成人票：${childPrice} × ${times} = ${adultPrice} 元。`
          ],
          trapNotice: '两数之差要除以“倍数 - 1”，求出基础的 1 份量。',
          bridgeTip: '小学经典应用题三大模型之一。',
          difficulty: 2
        };
      } else {
        const kinds = getRandomInt(3, 5);
        const ans = kinds + 1;
        const { options, correctIndex } = shuffleOptions(
          [`${ans} 个`, `${kinds} 个`, `${kinds * 2} 个`, `${ans + 5} 个`],
          `${ans} 个`
        );

        return {
          id,
          grade,
          subject: 'math',
          chapterId: 'g3_ch3',
          category: 'logic',
          title: '【抽屉原理】最不利原则摸球',
          subtitle: `箱子里有 ${kinds} 种不同颜色的球各 20 个。至少要摸出多少个球，才能保证一定有 2 个球颜色相同？`,
          options,
          correctIndex,
          keyPoint: '最坏情况（每种颜色各取 1 个） + 1',
          steps: [
            `考虑最倒霉的情况：前 ${kinds} 次摸到的球颜色全都不同（每种各 1 个）。`,
            `此时再摸第 ${ans} 个球，必定会和前面某种颜色重复。`,
            `因此最少需要摸出 ${kinds} + 1 = ${ans} 个球。`
          ],
          trapNotice: '注意是“保证一定”，必须按最倒霉的情况考虑！',
          bridgeTip: '四年级高阶逻辑抽屉原理。',
          difficulty: 3
        };
      }
    }
  }

  // ==========================================
  // 3. 语文学科无限题目生成 (Chinese)
  // ==========================================
  if (subject === 'chinese') {
    const chinesePool = [
      {
        cat: 'chinese_vocab' as QuestionCategory,
        title: '【拼音读音辨析】沪教版易错字音',
        q: '下列词语中加点字读音完全正确的一项是：',
        right: '澎湃 (péng pài) / 悄然 (qiǎo)',
        wrong: ['惬意 (qiè) / 执拗 (niù)', '气氛 (fèn) / 勉强 (qiáng)', '角色 (jiǎo) / 徘徊 (huái)'],
        tip: '注意“悄”在“悄然”中读 qiǎo；“惬”读 qiè；“角”读 jué',
        steps: ['仔细检查易错多音字和平尖音。', '正确选项是：澎湃 (péng pài) / 悄然 (qiǎo)']
      },
      {
        cat: 'chinese_vocab' as QuestionCategory,
        title: '【汉字字形部首】偏旁部首与结构',
        q: '“查”字用部首查字法，应先查哪个部首？再查几画？',
        right: '查“木”部，再查 5 画',
        wrong: ['查“木”部，再查 9 画', '查“日”部，再查 5 画', '查“一”部，再查 8 画'],
        tip: '“查”字上下结构，部首是下方的“木”，除去部首剩“日+一”，共5画',
        steps: ['确定部首为“木”（4画）。', '全字总笔画为 9 画，去掉部首 4 画后剩 5 画。']
      },
      {
        cat: 'chinese_vocab' as QuestionCategory,
        title: '【成语近反义词】古今词义积累',
        q: '与成语“胸有成竹”意思最为接近的词语是：',
        right: '成竹在胸 / 胜券在握',
        wrong: ['手足无措', '犹豫不决', '心惊肉跳'],
        tip: '“胸有成竹”比喻做事之前早有通盘考量和把握',
        steps: ['理解“胸有成竹”意为做事非常有把握。', '近义词为“胜券在握”。']
      },
      {
        cat: 'chinese_reading' as QuestionCategory,
        title: '【必背古诗名句】古诗意境赏析',
        q: '诗句“接天莲叶无穷碧，映日荷花别样红”描写的是哪里的夏日风光？',
        right: '杭州西湖',
        wrong: ['苏州园林', '南京秦淮河', '桂林山水'],
        tip: '出自宋代杨万里《晓出净慈寺送林子方》，描写西湖荷花',
        steps: ['回顾诗歌背景：《晓出净慈寺送林子方》。', '净慈寺位于杭州西湖畔，描写的是西湖美景。']
      },
      {
        cat: 'chinese_reading' as QuestionCategory,
        title: '【修辞手法辨析】语句赏析训练',
        q: '“微风吹过，满池的荷花在阳光下翩翩起舞。” 这句话运用了什么修辞手法？',
        right: '拟人',
        wrong: ['比喻', '夸张', '排比'],
        tip: '把荷花赋予人的动作“翩翩起舞”，属于拟人手法',
        steps: ['分析句中的动词“翩翩起舞”。', '荷花是植物，赋予人类的舞蹈动作，是典型的拟人手法。']
      },
      {
        cat: 'chinese_vocab' as QuestionCategory,
        title: '【关联词语运用】逻辑句型拓展',
        q: '在括号里填入恰当的关联词：“小明（  ）成绩优秀，（  ）非常乐于帮助同学。”',
        right: '不仅……而且……',
        wrong: ['因为……所以……', '虽然……但是……', '哪怕……也……'],
        tip: '后半句是对前半句的递进补充，应用递进关联词“不仅……而且……”',
        steps: ['辨析分句间的逻辑关系：递进关系。', '选择表示递进关系的“不仅……而且……”。']
      }
    ];

    const item = chinesePool[getRandomInt(0, chinesePool.length - 1)];
    const { options, correctIndex } = shuffleOptions([item.right, ...item.wrong], item.right);

    return {
      id,
      grade,
      subject: 'chinese',
      chapterId: grade === 'g1_to_g2' ? 'g1_chi_ch1' : 'g3_chi_ch1',
      category: item.cat,
      title: item.title,
      subtitle: item.q,
      options,
      correctIndex,
      keyPoint: item.tip,
      steps: item.steps,
      trapNotice: '仔细审题，区分字词语义与语境关联。',
      bridgeTip: '提升语文素养与综合语言运用能力。',
      difficulty: 1
    };
  }

  // ==========================================
  // 4. 英语学科无限题目生成 (English)
  // ==========================================
  const engPool = [
    {
      cat: 'english_grammar' as QuestionCategory,
      title: '【English Grammar】Verb Tenses (Be动词/时态)',
      q: 'Look! The students _____ running on the playground right now.',
      right: 'are',
      wrong: ['is', 'am', 'was'],
      tip: 'Look! 表示现在进行时 (be + V-ing)，主语 students 是复数，be动词用 are',
      steps: ['Identify the keyword "Look!", indicating Present Continuous Tense.', 'Subject "The students" is plural, so we use "are".']
    },
    {
      cat: 'english_vocab' as QuestionCategory,
      title: '【Vocabulary & Categories】Words Classification',
      q: 'Which word does NOT belong to the group of "Stationery" (文具)?',
      right: 'Pineapple',
      wrong: ['Ruler', 'Pencil', 'Eraser'],
      tip: 'Pineapple (菠萝) 是水果类，其余 Ruler/Pencil/Eraser 都是文具',
      steps: ['Stationery means 文具 (ruler, pencil, eraser).', 'Pineapple is a fruit!']
    },
    {
      cat: 'english_grammar' as QuestionCategory,
      title: '【Past Tense】Irregular Verbs (不规则动词)',
      q: 'Yesterday afternoon, Lily _____ a wonderful song at the school show.',
      right: 'sang',
      wrong: ['sing', 'singed', 'sings'],
      tip: 'Yesterday 表示一般过去时，sing 的不规则过去式是 sang',
      steps: ['Keyword "Yesterday" requires Past Tense.', 'The past form of "sing" is "sang".']
    },
    {
      cat: 'english_grammar' as QuestionCategory,
      title: '【Prepositions】Time & Place (介词辨析)',
      q: 'Our class meeting will start _____ 8:30 _____ Monday morning.',
      right: 'at; on',
      wrong: ['in; on', 'at; in', 'on; at'],
      tip: '具体时间点用 at (at 8:30)，具体某天的早晨用 on (on Monday morning)',
      steps: ['Specific clock time uses "at".', 'Specific day/morning uses "on".']
    },
    {
      cat: 'english_reading' as QuestionCategory,
      title: '【Situational English】Daily Dialogue',
      q: '— "Could you please pass me the salt?" — "_____, here you are."',
      right: 'Sure',
      wrong: ['Never mind', 'No, thanks', 'You are welcome'],
      tip: '对请求帮忙递东西的礼貌应答用 "Sure, here you are."',
      steps: ['Understand the polite request.', '"Sure" expresses willing agreement.']
    },
    {
      cat: 'english_vocab' as QuestionCategory,
      title: '【Plural Nouns】Special Noun Plurals (复数变词)',
      q: 'There are five _____ and three _____ playing games in the park.',
      right: 'children; mice',
      wrong: ['childs; mouses', 'childrens; mices', 'child; mouse'],
      tip: 'child 的复数是 children；mouse 的复数是 mice',
      steps: ['Irregular plural forms: child -> children.', 'mouse -> mice.']
    }
  ];

  const eItem = engPool[getRandomInt(0, engPool.length - 1)];
  const { options, correctIndex } = shuffleOptions([eItem.right, ...eItem.wrong], eItem.right);

  return {
    id,
    grade,
    subject: 'english',
    chapterId: grade === 'g1_to_g2' ? 'g1_eng_ch1' : 'g3_eng_ch1',
    category: eItem.cat,
    title: eItem.title,
    subtitle: eItem.q,
    options,
    correctIndex,
    keyPoint: eItem.tip,
    steps: eItem.steps,
    trapNotice: '注意动词时态、名词单复数与情景交际语法规则！',
    bridgeTip: '沪教版英语核心句型与词汇特训。',
    difficulty: 1
  };
}

/**
 * 批量动态生成新题目补充到列表中，确保题目永不枯竭！
 */
export function generateBatchQuestions(
  count: number = 5,
  grade: GradeLevel = 'g1_to_g2',
  subject: Subject = 'math',
  category?: QuestionCategory
): Question[] {
  const result: Question[] = [];
  for (let i = 0; i < count; i++) {
    result.push(generateRandomQuestion(grade, subject, category));
  }
  return result;
}
