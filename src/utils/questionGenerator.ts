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

/**
 * 离线/实时本地算法生成器：生成无限符合沪教版要求的规范高质量题目
 */
export function generateRandomQuestion(
  grade: GradeLevel = 'g1_to_g2',
  subject: Subject = 'math',
  category?: QuestionCategory
): Question {
  const id = `gen_${Date.now()}_${getRandomInt(1000, 9999)}`;
  const cat = category || (['calc', 'word', 'logic'] as QuestionCategory[])[getRandomInt(0, 2)];

  // 1. 1升2年级 数学
  if (grade === 'g1_to_g2' && subject === 'math') {
    if (cat === 'calc') {
      const type = getRandomInt(1, 3);
      if (type === 1) {
        // 凑十法连加，如 24 + 18 + 26
        const a1 = getRandomInt(1, 4) * 10 + 4; // 个位 4
        const a2 = getRandomInt(1, 3) * 10 + getRandomInt(1, 9);
        const a3 = getRandomInt(1, 3) * 10 + 6; // 个位 6
        const sum = a1 + a2 + a3;
        const wrong1 = sum + 10;
        const wrong2 = sum - 10;
        const wrong3 = sum - 2;
        const { options, correctIndex } = shuffleOptions([`${sum}`, `${wrong1}`, `${wrong2}`, `${wrong3}`], `${sum}`);

        return {
          id,
          grade,
          subject,
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
      } else if (type === 2) {
        // 乘法初步：求 N 个 M 相加
        const m = getRandomInt(3, 8);
        const n = getRandomInt(3, 5);
        const exprStr = Array(n).fill(m).join(' + ');
        const ans = m * n;
        const wrong1 = m + n;
        const wrong2 = m * n - m;
        const wrong3 = m * n + n;
        const correctStr = `${m} × ${n} = ${ans}`;
        const { options, correctIndex } = shuffleOptions(
          [correctStr, `${m} + ${n} = ${wrong1}`, `${m} × ${n - 1} = ${wrong2}`, `${m} + ${m} = ${m * 2}`],
          correctStr
        );

        return {
          id,
          grade,
          subject,
          chapterId: 'g1_ch1',
          category: 'calc',
          title: `【乘法初步】求 ${n} 个 ${m} 相加`,
          expression: `${exprStr} = ?`,
          options,
          correctIndex,
          keyPoint: '求几个相同加数的和，写成乘法算式更简便',
          steps: [
            `相同的加数是 ${m}，共有 ${n} 个 ${m}。`,
            `写成乘法算式为 ${m} × ${n} 或 ${n} × ${m}。`,
            `计算得出结果为 ${ans}。`
          ],
          trapNotice: '千万不要误写成加法算式 ${m} + ${n} 哦！',
          bridgeTip: '二年级乘法口诀表预习。',
          difficulty: 1
        };
      } else {
        // 两位数退位减法巧算，如 83 - 39
        const ten = getRandomInt(6, 9) * 10;
        const sub = getRandomInt(2, 5) * 10 + 9; // 如 39, 49
        const base = ten + getRandomInt(1, 4); // 如 83
        const ans = base - sub;
        const nearTen = sub + 1; // 40
        const { options, correctIndex } = shuffleOptions(
          [`${ans}`, `${ans - 2}`, `${ans + 10}`, `${ans + 2}`],
          `${ans}`
        );

        return {
          id,
          grade,
          subject,
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
      // 间隔问题或倒推问题
      const numCuts = getRandomInt(2, 6);
      const segments = numCuts + 1;
      const { options, correctIndex } = shuffleOptions(
        [`${segments} 段`, `${numCuts} 段`, `${numCuts + 2} 段`, `${numCuts - 1} 段`],
        `${segments} 段`
      );

      return {
        id,
        grade,
        subject,
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
      // 逻辑题：排队问题
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
        subject,
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
  }

  // 2. 3升4年级 数学
  if (grade === 'g3_to_g4' && subject === 'math') {
    if (cat === 'calc') {
      // 125 * (80 - N) 或 25 * 44 等分配律/拆数
      const factor = getRandomInt(2, 9);
      const mult = 125 * factor * 8; // 1000 * factor
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
        subject,
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
      // 差倍问题
      const times = getRandomInt(3, 5); // 3, 4, 5
      const childPrice = getRandomInt(15, 35) * 2; // 30, 40, 50, 60...
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
        subject,
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
      // 最不利原则
      const kinds = getRandomInt(3, 5);
      const ans = kinds + 1;
      const { options, correctIndex } = shuffleOptions(
        [`${ans} 个`, `${kinds} 个`, `${kinds * 2} 个`, `${ans + 5} 个`],
        `${ans} 个`
      );

      return {
        id,
        grade,
        subject,
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

  // 3. 语文学科无限题目生成
  if (subject === 'chinese') {
    const wordList = [
      { q: '“明”字加一笔，可以变成哪个字？', right: '昍', wrong: ['月', '日', '晴', '晶'], tip: '日+月=明，再加一笔为昍' },
      { q: '选择描写“秋天”景色的诗句：', right: '停车坐爱枫林晚，霜叶红于二月花。', wrong: ['草长莺飞二月天，拂堤杨柳醉春烟。', '接天莲叶无穷碧，映日荷花别样红。', '忽如一夜春风来，千树万树梨花开。'], tip: '枫叶红了是秋天景色' },
      { q: '“虚心使人进步，_____使人落后。”横线上应填：', right: '骄傲', wrong: ['努力', '谦虚', '勇敢'], tip: '反义词积累：虚心对骄傲' }
    ];
    const item = wordList[getRandomInt(0, wordList.length - 1)];
    const { options, correctIndex } = shuffleOptions([item.right, ...item.wrong], item.right);

    return {
      id,
      grade,
      subject: 'chinese',
      chapterId: grade === 'g1_to_g2' ? 'g1_chi_ch1' : 'g3_chi_ch1',
      category: 'chinese_vocab',
      title: '【语文综合积累】拓展特训',
      subtitle: item.q,
      options,
      correctIndex,
      keyPoint: item.tip,
      steps: ['认真审题，理解字词句的语法与诗词意境。', `正确答案是：${item.right}`],
      trapNotice: '注意成语与诗词字词积累。',
      bridgeTip: '提升语文素养与阅读能力。',
      difficulty: 1
    };
  }

  // 4. 英语学科无限题目生成
  const engList = [
    { q: 'Choose the correct word: "There _____ two apples on the table."', right: 'are', wrong: ['is', 'am', 'be'], tip: 'two apples 是复数，用 are' },
    { q: 'Select the past tense of "go":', right: 'went', wrong: ['goed', 'going', 'goes'], tip: 'go 的不规则过去式是 went' },
    { q: 'What is the opposite of "heavy"?', right: 'light', wrong: ['big', 'dark', 'small'], tip: 'heavy (重) 的反义词是 light (轻)' }
  ];
  const eItem = engList[getRandomInt(0, engList.length - 1)];
  const { options, correctIndex } = shuffleOptions([eItem.right, ...eItem.wrong], eItem.right);

  return {
    id,
    grade,
    subject: 'english',
    chapterId: grade === 'g1_to_g2' ? 'g1_eng_ch1' : 'g3_eng_ch1',
    category: 'english_grammar',
    title: '【英语语法词汇】拓展特训',
    subtitle: eItem.q,
    options,
    correctIndex,
    keyPoint: eItem.tip,
    steps: ['识别句中的时间状语与主谓单复数一致关系。', `正确选项是：${eItem.right}`],
    trapNotice: '注意名词单复数与动词时态变化！',
    bridgeTip: '沪教版英语核心句型。',
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
