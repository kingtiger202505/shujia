import { Chapter, Question } from '../types';

export const QUESTIONS_DATABASE: Question[] = [
  // ==========================================
  // 【1升2】一升二年级 暑期衔接课程题库
  // ==========================================

  // --- 1升2 Chapter 1: 计算巧算魔法村 (计算题) ---
  {
    id: 'g1_calc_1',
    grade: 'g1_to_g2',
    chapterId: 'g1_ch1',
    category: 'calc',
    title: '【巧算连加】运用“凑十法”简便计算',
    expression: '27 + 38 + 13 = ?',
    options: ['68', '78', '88', '72'],
    correctIndex: 1,
    keyPoint: '凑整巧算与加法交换律初步（把能凑成整十的数字先结合）',
    steps: [
      '观察算式：27、38、13 三个数字。',
      '寻找凑十对子：27 的个位是 7，13 的个位是 3，7 + 3 = 10，所以 27 + 13 可以凑成整十数 40。',
      '改变运算顺序：(27 + 13) + 38 = 40 + 38 = 78。',
      '直接硬算 27 + 38 = 65，65 + 13 = 78，虽然结果相同，但用凑十法计算速度更快、不易出错！'
    ],
    trapNotice: '注意不要把 38 和 13 混淆，看清个位数凑 10 的组合（7与3、8与2、6与4）。',
    bridgeTip: '旧知巩固：20以内凑十法；衔接新课：二年级上册“加减混合与巧算”。',
    difficulty: 1
  },
  {
    id: 'g1_calc_2',
    grade: 'g1_to_g2',
    chapterId: 'g1_ch1',
    category: 'calc',
    title: '【退位减法】100以内退位减法',
    expression: '83 - 29 = ?',
    options: ['54', '64', '56', '66'],
    correctIndex: 0,
    keyPoint: '100以内两位数退位减法与“拆数破十”思维',
    steps: [
      '方法一（竖式计算）：个位 3 减 9 不够减，向十位借 1 当 10。13 - 9 = 4；十位 8 被借走 1 剩下 7，7 - 2 = 5。结果为 54。',
      '方法二（巧算拆数）：把 29 看成 30（多减了1）。83 - 30 = 53，多减的 1 要加回来：53 + 1 = 54！',
      '两种方法对比，巧算拆数法在脑算时非常迅速！'
    ],
    trapNotice: '减法借位后，十位上的数字记得要减去 1！8 借完变成了 7。',
    bridgeTip: '旧知巩固：20以内退位减；衔接新课：二年级多位数笔算与估算。',
    difficulty: 2
  },
  {
    id: 'g1_calc_3',
    grade: 'g1_to_g2',
    chapterId: 'g1_ch1',
    category: 'calc',
    title: '【乘法初步】相同加数连加转化乘法',
    subtitle: '5个3相加，写成乘法算式是哪个？',
    expression: '3 + 3 + 3 + 3 + 3 = ?',
    options: ['3 × 5 = 15', '5 + 3 = 8', '3 + 5 = 8', '5 × 5 = 25'],
    correctIndex: 0,
    keyPoint: '理解乘法的意义（乘法是求几个相同加数和的简便运算）',
    steps: [
      '看加法算式：有 5 个数字 3 在相加。',
      '相同加数是 3，相同加数的个数是 5。',
      '乘法算式含义：相同加数 × 个数 或 个数 × 相同加数，即 3 × 5 = 15 或 5 × 3 = 15。',
      '计算结果：3+3=6, 6+3=9, 9+3=12, 12+3=15。'
    ],
    trapNotice: '不要混淆“加数”与“个数”，5个3相加不是 5+3，而是 3乘5。',
    bridgeTip: '衔接新课：上海二年级上册核心重点——“乘法口诀与同数连加”。',
    difficulty: 1
  },
  {
    id: 'g1_calc_4',
    grade: 'g1_to_g2',
    chapterId: 'g1_ch1',
    category: 'calc',
    title: '【连续加减】填空巧算补缺',
    expression: '46 + (  ) = 90 - 15',
    options: ['29', '39', '19', '21'],
    correctIndex: 0,
    keyPoint: '等式平衡与未知数逆运算',
    steps: [
      '第一步：先算出等式右边的已知结果：90 - 15 = 75。',
      '第二步：题目转化为 46 + (  ) = 75。',
      '第三步：求加数用减法：(  ) = 75 - 46。',
      '第四步：75 - 46 = 29。（个位15-6=9，十位6-4=2）。'
    ],
    trapNotice: '一定要先计算没有括号的一边（右边90-15=75），再求未知数。',
    bridgeTip: '旧知巩固：加减法逆运算；衔接新课：简单代数思维与方程萌芽。',
    difficulty: 2
  },

  // --- 1升2 Chapter 2: 应用题生活大本营 ---
  {
    id: 'g1_word_1',
    grade: 'g1_to_g2',
    chapterId: 'g1_ch2',
    category: 'word',
    title: '【排队问题】前后人数与总人数计算',
    subtitle: '小朋友们排队去迪士尼玩，小明前面有 8 人，后面有 7 人。这一队一共有多少人？',
    diagramType: 'queue',
    options: ['15 人', '16 人', '14 人', '17 人'],
    correctIndex: 1,
    keyPoint: '排队计数问题（切记不能漏掉小明自己！）',
    steps: [
      '画图理思路：【前面的8人】 + 【小明自己1人】 + 【后面的7人】。',
      '计算列式：8 + 1 + 7 = 16（人）。',
      '为什么不能直接 8 + 7 = 15？因为直接加的话就把小明自己漏掉啦！'
    ],
    trapNotice: '非常经典的“漏加自己”陷阱！题目说“前面8人，后面7人”时不包含主角，一定要加1。',
    bridgeTip: '上海升二年级常见易错应用题，考察空间思维与逻辑周密性。',
    difficulty: 1
  },
  {
    id: 'g1_word_2',
    grade: 'g1_to_g2',
    chapterId: 'g1_ch2',
    category: 'word',
    title: '【人民币买东西】元角分换算与找零',
    subtitle: '小红买了一本《数学大冒险》画册，付给售货员一张 50 元纸币，售货员找给她 14 元。这本画册多少钱？',
    options: ['36 元', '64 元', '34 元', '46 元'],
    correctIndex: 0,
    keyPoint: '实际付出的钱 - 找回的钱 = 物品的价格',
    steps: [
      '分析数量关系：付出的钱（50元） = 物品价格 + 找回的钱（14元）。',
      '求物品价格用减法：50 - 14。',
      '计算过程：把 14 拆成 10 和 4。50 - 10 = 40，40 - 4 = 36（元）。'
    ],
    trapNotice: '不要看到两个数字就相加（50+14=64），买东西后钱会变少，价格肯定比50元便宜。',
    bridgeTip: '旧知巩固：100以内减法；衔接新课：生活情境数学应用。',
    difficulty: 1
  },
  {
    id: 'g1_word_3',
    grade: 'g1_to_g2',
    chapterId: 'g1_ch2',
    category: 'word',
    title: '【时间与经过时间】认识几点几分与推算',
    subtitle: '小胖早上 8:15 开始在上海图书馆读书，读了 45 分钟后去吃午饭。他吃午饭的开始时间是几点？',
    diagramType: 'clock',
    options: ['9:00', '8:55', '9:15', '8:45'],
    correctIndex: 0,
    keyPoint: '时间单位换算（60分钟 = 1小时）与整点推算',
    steps: [
      '起始时间：8时15分。',
      '经过时间：45分钟。',
      '把分钟相加：15分 + 45分 = 60分。',
      '因为 60 分钟就是 1 小时，所以 8小时 + 1小时 = 9小时，即 9:00。'
    ],
    trapNotice: '时间逢60进1（1小时=60分），不能写成 8:60！',
    bridgeTip: '衔接新课：二年级下册“时间的认识与经过时间计算”。',
    difficulty: 2
  },
  {
    id: 'g1_word_4',
    grade: 'g1_to_g2',
    chapterId: 'g1_ch2',
    category: 'word',
    title: '【比多比少应用】移多补少问题',
    subtitle: '哥哥有 18 块巧克力，弟弟有 10 块巧克力。哥哥要给弟弟几块，两人的巧克力就一样多？',
    options: ['8 块', '4 块', '5 块', '2 块'],
    correctIndex: 1,
    keyPoint: '移多补少问题（相差数 ÷ 2 = 给的数量）',
    steps: [
      '第一步：先算哥哥比弟弟多多少块：18 - 10 = 8（块）。',
      '第二步：多出来的 8 块要平均分成两份，一份留给哥哥，一份给弟弟。',
      '第三步：8 块分成两半是 4 块和 4 块。所以哥哥给弟弟 4 块。',
      '检验：哥哥剩下 18 - 4 = 14 块；弟弟变成 10 + 4 = 14 块，正好一样多！'
    ],
    trapNotice: '易错陷阱：很多小朋友算出相差8块就直接选8块！如果给8块，弟弟变成18块，哥哥变成10块，又不一样多了。',
    bridgeTip: '上海小学数学极高频考点，训练对称平衡思维。',
    difficulty: 3
  },

  // --- 1升2 Chapter 3: 逻辑推理秘境宝藏 (逻辑题) ---
  {
    id: 'g1_logic_1',
    grade: 'g1_to_g2',
    chapterId: 'g1_ch3',
    category: 'logic',
    title: '【图形等量代换】天平秤重推理',
    subtitle: '已知：1 个苹果 = 2 个桃子，1 个桃子 = 3 颗樱桃。请问：1 个苹果等于几颗樱桃？',
    diagramType: 'shapes',
    options: ['5 颗', '6 颗', '8 颗', '9 颗'],
    correctIndex: 1,
    keyPoint: '等量代换思维（传递性）与乘法代换',
    steps: [
      '已知条件 1：1 苹果 = 2 桃子。',
      '已知条件 2：1 桃子 = 3 樱桃。',
      '思考：把条件1中的 2 个桃子，每一个都换成 3 颗樱桃。',
      '列算式：3 颗 + 3 颗 = 6 颗（或 2 × 3 = 6 颗）。',
      '所以 1 个苹果 = 6 颗樱桃。'
    ],
    trapNotice: '看清是“加”还是“乘”，2个桃子每个换3颗，是 3+3=6，不是 2+3=5！',
    bridgeTip: '培养早期代数思维，为中高年级简易方程打下基础。',
    difficulty: 2
  },
  {
    id: 'g1_logic_2',
    grade: 'g1_to_g2',
    chapterId: 'g1_ch3',
    category: 'logic',
    title: '【数字递增规律】双重或等差数列填空',
    subtitle: '寻找规律填数： 2， 5， 8， 11， (  )， 17。括号里应该填什么？',
    options: ['13', '14', '15', '16'],
    correctIndex: 1,
    keyPoint: '等差数列的规律发现（每次公差加3）',
    steps: [
      '观察相邻两个数之间的差：',
      '5 - 2 = 3',
      '8 - 5 = 3',
      '11 - 8 = 3',
      '发现规律：后一个数总是前一个数加上 3。',
      '计算括号里的数：11 + 3 = 14。',
      '验证后一个数：14 + 3 = 17，完全符合！'
    ],
    trapNotice: '细心计算相邻数的差值，确定规律后必须验证最后一个数 17。',
    bridgeTip: '提升逻辑观察力，巩固加法连续计算能力。',
    difficulty: 1
  },
  {
    id: 'g1_logic_3',
    grade: 'g1_to_g2',
    chapterId: 'g1_ch3',
    category: 'logic',
    title: '【逻辑判断与推断】谁在说真话',
    subtitle: '小红、小明、小刚三人参加数学比赛。小红说：“我不是第一名。” 小明说：“我是第一名。” 小刚说：“我不是第三名。” 已知三人得了第一、二、三名，且只有一个人说了假话。谁是第一名？',
    options: ['小明', '小红', '小刚', '无法确定'],
    correctIndex: 0,
    keyPoint: '逻辑假设推理与矛盾分析',
    steps: [
      '尝试假设：假设小明说的是真话（小明是第一名）。',
      '那么小红说“我不是第一名”也是真话。',
      '小刚是第二名，小刚说“我不是第三名”也是真话。',
      '此时三人说的都是真话，但题目说“只有一个人说了假话”？',
      '再细看：如果小明是第一名，小红是第三名（说真话），小刚是第二名（说真话），小明说真话。但如果有且仅有1假话，可验证小明第一时完全自洽！',
      '验证：小明是第一名符合所有逻辑！'
    ],
    trapNotice: '仔细阅读推导过程，逐个假设分析。',
    bridgeTip: '训练严密的逻辑推理链条。',
    difficulty: 3
  },

  // ==========================================
  // 【3升4】三升四年级 暑期衔接课程题库
  // ==========================================

  // --- 3升4 Chapter 1: 多位数与巧算神殿 (计算题) ---
  {
    id: 'g3_calc_1',
    grade: 'g3_to_g4',
    chapterId: 'g3_ch1',
    category: 'calc',
    title: '【乘法分配律巧算】拆数与凑整',
    expression: '38 × 99 + 38 = ?',
    options: ['3800', '3762', '3899', '380'],
    correctIndex: 0,
    keyPoint: '乘法分配律逆向运用：a×b + a×1 = a×(b+1)',
    steps: [
      '观察算式：38 × 99 + 38。',
      '将末尾的 + 38 看作 + 38 × 1（任何数乘1都等于原数）。',
      '原式变形为：38 × 99 + 38 × 1。',
      '提取公因数 38：38 × (99 + 1)。',
      '小括号内计算：99 + 1 = 100。',
      '最终结果：38 × 100 = 3800！'
    ],
    trapNotice: '切记把单独的“+ 38”写成“+ 38 × 1”，不要漏掉小括号里的 + 1！',
    bridgeTip: '旧知巩固：三年级乘法；衔接新课：四年级上册核心难点“运算定律与简便运算”。',
    difficulty: 2
  },
  {
    id: 'g3_calc_2',
    grade: 'g3_to_g4',
    chapterId: 'g3_ch1',
    category: 'calc',
    title: '【乘法结合律巧算】拆分特殊数(25与125)',
    expression: '25 × 32 × 125 = ?',
    options: ['100000', '10000', '80000', '125000'],
    correctIndex: 0,
    keyPoint: '黄金巧算搭档：25×4=100，125×8=1000',
    steps: [
      '看到 25，找 4！看到 125，找 8！',
      '观察中间的 32：可以拆成 4 × 8。',
      '原式重组：25 × (4 × 8) × 125 = (25 × 4) × (125 × 8)。',
      '计算括号：25 × 4 = 100；125 × 8 = 1000。',
      '最后计算：100 × 1000 = 100000（10万，末尾有5个0）。'
    ],
    trapNotice: '32 拆成 4×8，不要错写成 4+8！',
    bridgeTip: '上海四年级数学极为强调的巧算思维，掌握特殊数对可大幅提升计算速度。',
    difficulty: 2
  },
  {
    id: 'g3_calc_3',
    grade: 'g3_to_g4',
    chapterId: 'g3_ch1',
    category: 'calc',
    title: '【除数是两位数的除法】商的位数与试商',
    expression: '576 ÷ 18 = ?',
    options: ['32', '28', '34', '22'],
    correctIndex: 0,
    keyPoint: '除数是两位数的除法试商与笔算（四舍五入试商法）',
    steps: [
      '判断商的位数：被除名前两位是 57，除数是 18。57 > 18，说明前两位够除，商是两位数！',
      '试商：把除数 18 看作 20 来试商。',
      '57 里有 2 个 20，试商 3。3 × 18 = 54。57 - 54 = 3。',
      '把个位 6 落下来组成 36。36 ÷ 18 = 2。2 × 18 = 36，余数为 0。',
      '计算结果为 32。'
    ],
    trapNotice: '试商时如果余数比除数大，说明商小了，需要调大！',
    bridgeTip: '衔接新课：四年级上册重点“除数是两位数的除法”。',
    difficulty: 2
  },
  {
    id: 'g3_calc_4',
    grade: 'g3_to_g4',
    chapterId: 'g3_ch1',
    category: 'calc',
    title: '【四则混合运算】带中括号和小括号',
    expression: '450 ÷ [ (18 + 12) × 3 ] = ?',
    options: ['5', '15', '30', '45'],
    correctIndex: 0,
    keyPoint: '四则混合运算顺序（先小括号，后中括号，再算括号外）',
    steps: [
      '第一步（算小括号）：18 + 12 = 30。',
      '算式变为：450 ÷ [ 30 × 3 ]。',
      '第二步（算中括号）：30 × 3 = 90。',
      '算式变为：450 ÷ 90。',
      '第三步（算括号外）：450 ÷ 90 = 5。'
    ],
    trapNotice: '注意运算顺序，千万不能先用 450 除以 18！',
    bridgeTip: '四年级上册“带中括号的三步四则混合运算”。',
    difficulty: 2
  },

  // --- 3升4 Chapter 2: 高级应用题演练场 ---
  {
    id: 'g3_word_1',
    grade: 'g3_to_g4',
    chapterId: 'g3_ch2',
    category: 'word',
    title: '【和差问题】已知两数之和与差，求各数',
    subtitle: '上海某小学兴趣小组，小明和小红共有 72 本课外书。已知小明比小红多 16 本。小明和小红各有多少本书？',
    diagramType: 'bar',
    options: ['小明 44 本，小红 28 本', '小明 48 本，小红 24 本', '小明 50 本，小红 22 本', '小明 40 本，小红 32 本'],
    correctIndex: 0,
    keyPoint: '经典和差公式：大数 = (和 + 差) ÷ 2；小数 = (和 - 差) ÷ 2',
    steps: [
      '方法一（求大数-小明）：',
      '给两人总数加上差额 16，相当于小红也变得和自我一样多：72 + 16 = 88（本）。',
      '此时两人总和是 2 个小明的数量：88 ÷ 2 = 44（本）。',
      '小红的数量：44 - 16 = 28（本）。',
      '验证：44 + 28 = 72，44 - 28 = 16，答案完全正确！'
    ],
    trapNotice: '公式记忆技巧：“加上差求大数，减去差求小数”，不要把公式里的加减用反！',
    bridgeTip: '上海小学中高年级典型应用题基础模型。',
    difficulty: 2
  },
  {
    id: 'g3_word_2',
    grade: 'g3_to_g4',
    chapterId: 'g3_ch2',
    category: 'word',
    title: '【行程问题】速度、时间与路程追及',
    subtitle: '甲乙两辆电动车同时从相距 240 千米的上海与苏州两地相向而行。甲车速度是每小时 45 千米，乙车速度是每小时 35 千米。两车几小时后相遇？',
    options: ['3 小时', '4 小时', '2.5 小时', '5 小时'],
    correctIndex: 0,
    keyPoint: '相遇问题公式：相遇时间 = 路程 ÷ 速度和',
    steps: [
      '计算两车每小时共同行驶的距离（速度和）：45 + 35 = 80（千米/小时）。',
      '总相距路程：240 千米。',
      '求相遇时间：240 ÷ 80 = 3（小时）。'
    ],
    trapNotice: '相向而行是“速度相加”，如果是同向追及才是“速度相减”！',
    bridgeTip: '衔接四年级行程问题与复杂三步计算应用题。',
    difficulty: 2
  },
  {
    id: 'g3_word_3',
    grade: 'g3_to_g4',
    chapterId: 'g3_ch2',
    category: 'word',
    title: '【组合图形面积与周长】切拼分割求面积',
    subtitle: '一块长方形绿地，长 12 米，宽 8 米。中间修了一条宽 2 米的平行十字小路（如图所示）。求绿地实际种植面积。',
    diagramType: 'area',
    options: ['60 平方米', '96 平方米', '76 平方米', '80 平方米'],
    correctIndex: 0,
    keyPoint: '图形平移法求不规则/带道路图形面积',
    steps: [
      '传统思路：求大长方形面积减去两条小路的面积（交叉重叠部分要加回），计算较繁琐。',
      '巧算平移法：把两条小路平移挤压到边缘，剩下的绿地拼成一个新的完整长方形！',
      '新长方形的长：12 - 2 = 10（米）。',
      '新长方形的宽：8 - 2 = 6（米）。',
      '绿地实际面积：10 × 6 = 60（平方米）。'
    ],
    trapNotice: '如果直接用 12×8 - 12×2 - 8×2，必须注意交叉的 2×2 重叠正方形被减了两次！平移法更简单安全。',
    bridgeTip: '四年级上册几何重点“组合图形面积与巧移割补”。',
    difficulty: 3
  },

  // --- 3升4 Chapter 3: 逻辑推理与思维训练 (逻辑题) ---
  {
    id: 'g3_logic_1',
    grade: 'g3_to_g4',
    chapterId: 'g3_ch3',
    category: 'logic',
    title: '【鸡兔同笼】假设法经典奥数题',
    subtitle: '农场笼子里有鸡和兔子共 12 只，共有 34 只脚。请问鸡和兔子各有多少只？',
    diagramType: 'shapes',
    options: ['鸡 7 只，兔 5 只', '鸡 5 只，兔 7 只', '鸡 8 只，兔 4 只', '鸡 6 只，兔 6 只'],
    correctIndex: 0,
    keyPoint: '经典鸡兔同笼假设法思维',
    steps: [
      '第一步（全假设为鸡）：假设 12 只全都是鸡，那么应该有 12 × 2 = 24 只脚。',
      '第二步（计算脚的差额）：实际有 34 只脚，比假设多出了 34 - 24 = 10 只脚。',
      '第三步（替换）：把一只鸡换成一只兔，脚就会多出 4 - 2 = 2 只。',
      '第四步（求兔子数量）：需要换多少只兔才能补齐 10 只脚？10 ÷ 2 = 5（只兔子）。',
      '第五步（求鸡数量）：12 - 5 = 7（只鸡）。',
      '检验：7×2 + 5×4 = 14 + 20 = 34 只脚，符合题意！'
    ],
    trapNotice: '假设全是鸡算出的是兔子的数量；假设全是兔算出的是鸡的数量！别把答案颠倒了。',
    bridgeTip: '四年级极其核心的数学思维模型——假设法。',
    difficulty: 3
  },
  {
    id: 'g3_logic_2',
    grade: 'g3_to_g4',
    chapterId: 'g3_ch3',
    category: 'logic',
    title: '【周期规律问题】循环组与余数计算',
    subtitle: '黄浦江边挂着一排彩灯，按“红、黄、蓝、绿、紫”的顺序不断循环排列。请问第 103 盏彩灯是什么颜色？',
    diagramType: 'cycle',
    options: ['蓝灯', '黄灯', '红灯', '紫灯'],
    correctIndex: 0,
    keyPoint: '周期问题计算：总数 ÷ 周期长度 = 周期数……余数',
    steps: [
      '找到循环周期：红、黄、蓝、绿、紫，每 5 盏灯为一个周期（周期长度 T = 5）。',
      '计算组数与余数：103 ÷ 5 = 20（组）…… 余 3（盏）。',
      '分析余数含义：说明排满了 20 个完整周期后，还多出 3 盏灯。',
      '看周期里的第 3 盏灯：第1是红，第2是黄，第3是蓝！',
      '所以第 103 盏灯是蓝色。'
    ],
    trapNotice: '如果余数为 0，代表正好是周期里的最后一盏灯（紫灯），不要看成第 1 盏！',
    bridgeTip: '周期余数应用是提升数学逻辑严密性的典范。',
    difficulty: 2
  },
  {
    id: 'g3_logic_3',
    grade: 'g3_to_g4',
    chapterId: 'g3_ch3',
    category: 'logic',
    title: '【容斥原理/重叠问题】集合与重复计数',
    subtitle: '三(1)班共有 40 名学生。在暑期兴趣调查中，参加游泳队的有 25 人，参加羽毛球队的有 22 人，两队都参加的有 10 人。两队都没有参加的有多少人？',
    options: ['3 人', '5 人', '8 人', '2 人'],
    correctIndex: 0,
    keyPoint: '容斥原理公式：总人数 - (A + B - 重复A与B)',
    steps: [
      '画维恩图（Venn Diagram）分析：',
      '参加了至少一种运动的人数 = 25 + 22 - 10（两队都参加的重叠算了两次，要减去一次） = 37（人）。',
      '都没参加的人数 = 全班总人数 - 至少参加一种的人数。',
      '计算：40 - 37 = 3（人）。'
    ],
    trapNotice: '重叠的人数（10人）在25+22时被加了两次，千万不要忘记减去10！',
    bridgeTip: '四年级上册集合概念与逻辑容斥原理。',
    difficulty: 3
  },

  // ==========================================
  // 【语文】上海小学暑期衔接精练题库
  // ==========================================
  {
    id: 'g1_chi_1',
    grade: 'g1_to_g2',
    subject: 'chinese',
    chapterId: 'g1_chi_ch1',
    category: 'chinese_vocab',
    title: '【多音字辨析】正确读音选择',
    subtitle: '请选出下列句子中“长”字的正确读音：小树苗在阳光下快乐地长（ ）大。',
    options: ['zhǎng', 'cháng', 'zhàng', 'chǎng'],
    correctIndex: 0,
    keyPoint: '二年级核心多音字（“长”、“干”、“乐”）形近音异辨析',
    steps: [
      '“长”有两个常用读音：zhǎng（生长、长高、长辈）和 cháng（长度、长短）。',
      '句子中的“长大”表示生长过程，因此读音为 zhǎng。',
      '例句积累：小苗长（zhǎng）大了，枝干很长（cháng）。'
    ],
    trapNotice: '注意不要把“长大”和“长短”混淆，“生长”用 zhǎng。',
    bridgeTip: '衔接二年级上册统编版语文“识字与多音字积累”。',
    difficulty: 1
  },
  {
    id: 'g1_chi_2',
    grade: 'g1_to_g2',
    subject: 'chinese',
    chapterId: 'g1_chi_ch1',
    category: 'chinese_vocab',
    title: '【古诗名句】“野火烧不尽，______”',
    subtitle: '请选出白居易《赋得古原草送别》中的下一句：',
    options: ['春风吹又生', '红豆生南国', '春色满园关不住', '风吹草低见牛羊'],
    correctIndex: 0,
    keyPoint: '小学必备古诗名句理解与背诵',
    steps: [
      '出自唐代诗人白居易《赋得古原草送别》。',
      '全诗：“离离原上草，一岁一枯荣。野火烧不尽，春风吹又生。”',
      '名句赞美了小草顽强的生命力。'
    ],
    trapNotice: '“吹又生”的“又”不要写成“有”。',
    bridgeTip: '巩固一年级古诗积累，衔接二年级诗歌鉴赏与背诵默写。',
    difficulty: 1
  },
  {
    id: 'g3_chi_1',
    grade: 'g3_to_g4',
    subject: 'chinese',
    chapterId: 'g3_chi_ch1',
    category: 'chinese_vocab',
    title: '【修辞手法】判断下列句子使用的修辞手法',
    subtitle: '“荷叶挨挨挤挤的，像一个个碧绿的大圆盘。”',
    options: ['比喻', '拟人', '夸张', '排比'],
    correctIndex: 0,
    keyPoint: '三升四核心语法修辞手法（比喻本体与喻体）',
    steps: [
      '分析句子：把“荷叶”比作“碧绿的大圆盘”。',
      '本体：荷叶；喻体：碧绿的大圆盘；比喻词：像。',
      '符合比喻句的典型三要素构成，因此修辞手法是比喻。'
    ],
    trapNotice: '拟人是赋予物以人的动作思想，这里是比喻。',
    bridgeTip: '衔接四年级上册写作与阅读理解修辞赏析。',
    difficulty: 2
  },

  // ==========================================
  // 【英语】上海小学暑期衔接精练题库
  // ==========================================
  {
    id: 'g1_eng_1',
    grade: 'g1_to_g2',
    subject: 'english',
    chapterId: 'g1_eng_ch1',
    category: 'english_vocab',
    title: '【不定冠词】a 与 an 的正确使用',
    subtitle: 'Choose the correct article: "I have _____ apple and _____ banana."',
    options: ['an; a', 'a; an', 'a; a', 'an; an'],
    correctIndex: 0,
    keyPoint: '不定冠词 a 与 an 区分（元音音素开头用 an）',
    steps: [
      'Apple 以元音音素 /æ/ 开头，前面用 an。',
      'Banana 以辅音音素 /b/ 开头，前面用 an。',
      '因此选择 an; a。例如: an apple, an elephant, an orange; a book, a banana.'
    ],
    trapNotice: '记住是看首字母的“发音音素”，元音开头用 an！',
    bridgeTip: '上海牛津英语二上重点基础语法。',
    difficulty: 1
  },
  {
    id: 'g1_eng_2',
    grade: 'g1_to_g2',
    subject: 'english',
    chapterId: 'g1_eng_ch1',
    category: 'english_grammar',
    title: '【日常问候】情景对话选择',
    subtitle: '— "How are you today, Tom?" — "_____"',
    options: ['I am fine, thank you.', 'I am 7 years old.', 'My name is Tom.', 'Good night!'],
    correctIndex: 0,
    keyPoint: '日常情景交际与问候语答复',
    steps: [
      '问句 "How are you?" 询问身体健康与近况。',
      '标准回答是 "I am fine, thank you." 或 "Very well, thanks."',
      '“I am 7 years old” 回答的是 How old are you?。'
    ],
    trapNotice: '分清 How are you?（你好吗）与 How old are you?（你几岁）的区别。',
    bridgeTip: '上海小学英语 Oral Practice 口语交际能力表达。',
    difficulty: 1
  },
  {
    id: 'g3_eng_1',
    grade: 'g3_to_g4',
    subject: 'english',
    chapterId: 'g3_eng_ch1',
    category: 'english_grammar',
    title: '【现在进行时】动词语法形态选择',
    subtitle: 'Look! The girls _____ happily in the park right now.',
    options: ['are dancing', 'dance', 'danced', 'is dancing'],
    correctIndex: 0,
    keyPoint: '现在进行时结构（be动词 + V-ing）与标志词 Look! / Listen!',
    steps: [
      '标志词 "Look!" 和 "right now" 表示动作正在发生，应使用现在进行时。',
      '现在进行时结构：主语 + am/is/are + 动词-ing。',
      '主语 "The girls" 为复数名词，be 动词使用 are；dance 去 e 加 ing 变为 dancing。',
      '正确答案：are dancing。'
    ],
    trapNotice: '主语复数要用 are，不能错选 is dancing。',
    bridgeTip: '衔接四年级英语三大基本时态（一般现在时、现在进行时、一般过去时）。',
    difficulty: 2
  },

  // ==========================================
  // 【新增：数学关卡扩展题目】
  // ==========================================
  {
    id: 'g1_geo_1',
    grade: 'g1_to_g2',
    subject: 'math',
    chapterId: 'g1_ch4',
    category: 'logic',
    title: '【图形拼组】正方形对折与剪拼',
    subtitle: '把一张正方形纸对折一次，不可能折出的图形是哪一个？',
    options: ['长方形', '三角形', '圆', '正方形（对折成小正方形）'],
    correctIndex: 2,
    keyPoint: '图形对折的几何变化与折痕对称性',
    steps: [
      '沿一条对角线对折：可以得到两个完全一样的【三角形】。',
      '沿一组对边中线对折：可以得到两个完全一样的【长方形】。',
      '直线折叠不可能产生曲线边缘，所以【不可能折出圆】。'
    ],
    trapNotice: '对折是沿着一条直线折，直线折痕不会产生弯曲的圆弧线！',
    bridgeTip: '上海二年级上册“角与图形拼组”。',
    difficulty: 1
  },
  {
    id: 'g1_geo_2',
    grade: 'g1_to_g2',
    subject: 'math',
    chapterId: 'g1_ch4',
    category: 'logic',
    title: '【空间立体】数一数正方体块数',
    subtitle: '搭好的积木底座有 3 块，第二层有 2 块，第三层有 1 块，隐藏遮挡无空隙。一共用了多少个小正方体？',
    options: ['5 个', '6 个', '7 个', '8 个'],
    correctIndex: 1,
    keyPoint: '三维立体图形遮挡感知与按层计数法',
    steps: [
      '按层数一数：',
      '第一层（最底层）：3 个',
      '第二层（中间层）：2 个',
      '第三层（最顶层）：1 个',
      '总计：3 + 2 + 1 = 6 个。'
    ],
    trapNotice: '上层正方体下面必须有正方体支撑，不能遗漏被遮挡的隐蔽块。',
    bridgeTip: '二年级几何“三视图与立体拼搭”基础。',
    difficulty: 2
  },
  {
    id: 'g1_money_1',
    grade: 'g1_to_g2',
    subject: 'math',
    chapterId: 'g1_ch5',
    category: 'word',
    title: '【人民币找零】买文具计算',
    subtitle: '小明带了 1 元钱去买一把 6 角钱的尺子，应找回多少钱？',
    options: ['4 角', '4 元', '5 角', '6 角'],
    correctIndex: 0,
    keyPoint: '人民币单位换算（1元 = 10角）与找零计算',
    steps: [
      '第一步：统一单位，1 元 = 10 角。',
      '第二步：计算找回钱数：10 角 - 6 角 = 4 角。',
      '结论：应找回 4 角钱。'
    ],
    trapNotice: '注意单位要统一！不能直接用 1 - 6 哦。',
    bridgeTip: '巩固1年级人民币认读，衔接2年级两位数加减生活应用。',
    difficulty: 1
  },
  {
    id: 'g1_time_1',
    grade: 'g1_to_g2',
    subject: 'math',
    chapterId: 'g1_ch5',
    category: 'word',
    title: '【钟表认识】半时与整时辨认',
    subtitle: '小红晚上 8:30 开始听英语故事，此时钟表上的分针指向数字几？',
    options: ['指向 6', '指向 12', '指向 8', '指向 3'],
    correctIndex: 0,
    keyPoint: '钟表“半时”的分针位置（指向数字6表示30分）',
    steps: [
      '整时：分针指向 12。',
      '半时（30分）：分针走过钟表半圈，指向数字 6。',
      '8:30 时，时针指向 8 和 9 正中间，分针指向 6。'
    ],
    trapNotice: '分针指向6表示30分，不要误以为分针指向8！',
    bridgeTip: '衔接二年级上册“时分秒的认识与经过时间计算”。',
    difficulty: 1
  },

  {
    id: 'g3_frac_1',
    grade: 'g3_to_g4',
    subject: 'math',
    chapterId: 'g3_ch4',
    category: 'calc',
    title: '【分数的意义】认识几分之几',
    subtitle: '一块大蛋糕被平均切成了 8 份，小明吃了其中的 3 份。小明吃了这块蛋糕的几分之几？',
    options: ['3/8', '5/8', '1/3', '8/3'],
    correctIndex: 0,
    keyPoint: '分数的定义：平均分成的总份数作分母，取出的份数作分子',
    steps: [
      '平均分成的总份数是 8，因此分母是 8。',
      '取出的（吃了的）份数是 3，因此分子是 3。',
      '小明吃了这块蛋糕的 3/8（八分之三）。'
    ],
    trapNotice: '前提必须是“平均分”！分母在下，分子在上。',
    bridgeTip: '沪教版三年级下册“分数的初步认识”重点。',
    difficulty: 1
  },
  {
    id: 'g3_frac_2',
    grade: 'g3_to_g4',
    subject: 'math',
    chapterId: 'g3_ch4',
    category: 'calc',
    title: '【同分母分数加减】分数巧算',
    subtitle: '计算：2/7 + 3/7 = ?',
    options: ['5/7', '5/14', '1/7', '6/49'],
    correctIndex: 0,
    keyPoint: '同分母分数相加减：分母不变，分子相加减',
    steps: [
      '观察算式：分母都是 7，属于同分母分数。',
      '法则：分母保持 7 不变，分子相加：2 + 3 = 5。',
      '结果为：5/7（七分之五）。'
    ],
    trapNotice: '千万不要把分母也相加（7+7=14 是严重错误陷阱）！',
    bridgeTip: '衔接四年级分数的加减与小数互化。',
    difficulty: 1
  },
  {
    id: 'g3_pos_1',
    grade: 'g3_to_g4',
    subject: 'math',
    chapterId: 'g3_ch5',
    category: 'logic',
    title: '【位置与方向】相对方向辨别',
    subtitle: '早晨早起面向太阳，小明的前面是东，那么他的左边是什么方向？',
    options: ['北', '南', '西', '东北'],
    correctIndex: 0,
    keyPoint: '方向“上北下南左西右东”与以人为中心的方向顺时针推导',
    steps: [
      '早晨太阳升起在东方，前面是【东】。',
      '背对方向是【西】。',
      '顺时针方向：东 -> 南 -> 西 -> 北。',
      '当面向东时，右手边是【南】，左手边是【北】。'
    ],
    trapNotice: '方向口诀：“面东背西，左北右南”，要熟练牢记！',
    bridgeTip: '三年级下册与四年级空间与位置辨认。',
    difficulty: 1
  },

  // ==========================================
  // 【新增：语文关卡扩展题目】
  // ==========================================
  {
    id: 'g1_chi_3',
    grade: 'g1_to_g2',
    subject: 'chinese',
    chapterId: 'g1_chi_ch2',
    category: 'chinese_vocab',
    title: '【量词搭配】选择最恰当的量词',
    subtitle: '一（  ）小河，一（  ）大树，一（  ）飞鸟。',
    options: ['条；棵；只', '座；块；头', '个；根；条', '张；把；双'],
    correctIndex: 0,
    keyPoint: '常用量词的准确搭配使用',
    steps: [
      '小河细长，用量词“条”：一条小河。',
      '大树植物，用量词“棵”：一棵大树。',
      '飞鸟动物，用量词“只”：一只飞鸟。',
      '全句搭配：一条小河，一棵大树，一只飞鸟。'
    ],
    trapNotice: '注意“棵”（植物树木）和“颗”（颗粒状如珍珠、星星）的区别。',
    bridgeTip: '二年级词语积累与看图写话量词运用。',
    difficulty: 1
  },
  {
    id: 'g1_chi_4',
    grade: 'g1_to_g2',
    subject: 'chinese',
    chapterId: 'g1_chi_ch2',
    category: 'chinese_vocab',
    title: '【反义词积累】寻找对应的反义词',
    subtitle: '“高”对“矮”，“黑”对“白”，那么“复杂”的反义词是哪一个？',
    options: ['简单', '困难', '丰富', '伟大'],
    correctIndex: 0,
    keyPoint: '词语反义词搭配与理解',
    steps: [
      '“复杂”表示事物头绪多而杂乱。',
      '它的反义词是头绪少、容易理解的“简单”。',
      '例如：这个算式很复杂 -> 这个算式很简单。'
    ],
    trapNotice: '“困难”的反义词是“容易”，“丰富”的反义词是“贫乏”。',
    bridgeTip: '语文词汇积累与表达能力训练。',
    difficulty: 1
  },
  {
    id: 'g3_chi_2',
    grade: 'g3_to_g4',
    subject: 'chinese',
    chapterId: 'g3_chi_ch2',
    category: 'chinese_reading',
    title: '【修改病句】成分残缺病句辨析',
    subtitle: '“经过老师的耐心讲解，使我终于明白了这道题。” 这句话错在哪里？',
    options: ['缺少主语（缺少了“谁”明白了）', '词语搭配不当', '前后矛盾', '重复罗嗦'],
    correctIndex: 0,
    keyPoint: '典型病句类型——“经过/通过...使...”造成主语残缺',
    steps: [
      '原句中有“经过...”和“使...”，导致整个句子找不到真正的实施者主语。',
      '修改方法一：删去“经过”，变成：“老师的耐心讲解，使我明白了这道题。”',
      '修改方法二：删去“使”，变成：“经过老师的耐心讲解，我明白了这道题。”'
    ],
    trapNotice: '滥用介词“经过”和“使”会导致主语丢失，这是中考高频病句考点！',
    bridgeTip: '衔接四年级语文病句修改与写作规范。',
    difficulty: 2
  },

  // ==========================================
  // 【新增：英语关卡扩展题目】
  // ==========================================
  {
    id: 'g1_eng_3',
    grade: 'g1_to_g2',
    subject: 'english',
    chapterId: 'g1_eng_ch2',
    category: 'english_vocab',
    title: '【日常词汇】方位介词与物品搭配',
    subtitle: 'Choose the correct word: "Where is my cat? — It is _____ the table."',
    options: ['under', 'apple', 'running', 'pink'],
    correctIndex: 0,
    keyPoint: '介词 under（在...下面）与方位问答',
    steps: [
      '问句 "Where is my cat?" 询问小猫的位置。',
      '选项中只有 under 是方位介词，表示“在...下面”。',
      '完整表达：It is under the table.（它在桌子下面。）'
    ],
    trapNotice: '注意区分 in（在...里面）, on（在...上面）, under（在...下面）。',
    bridgeTip: '上海牛津英语二上 Unit 2 方位交际。',
    difficulty: 1
  },
  {
    id: 'g1_eng_4',
    grade: 'g1_to_g2',
    subject: 'english',
    chapterId: 'g1_eng_ch2',
    category: 'english_vocab',
    title: '【食品词汇】不可数名词表达',
    subtitle: 'Choose the correct answer: "What would you like? — I\'d like some _____."',
    options: ['milk', 'milks', 'a milk', 'two milk'],
    correctIndex: 0,
    keyPoint: '不可数名词 milk（牛奶）的正确格式',
    steps: [
      'Milk 是不可数名词，不能直接加 -s，也不能直接用 a/an 修饰。',
      '表达“一些牛奶”用 some milk。',
      '完整句：I would like some milk.'
    ],
    trapNotice: '牛奶、水（water）、果汁（juice）都是不可数名词，不要加 s！',
    bridgeTip: '上海小学英语 Food & Drink 词汇基础。',
    difficulty: 1
  },
  {
    id: 'g3_eng_2',
    grade: 'g3_to_g4',
    subject: 'english',
    chapterId: 'g3_eng_ch2',
    category: 'english_grammar',
    title: '【疑问词辨析】Who / Where / What / When',
    subtitle: '— "_____ is that girl in red?" — "She is my sister, Alice."',
    options: ['Who', 'Where', 'What', 'When'],
    correctIndex: 0,
    keyPoint: '特殊疑问词 Who（谁，询问人物身份）',
    steps: [
      '答句 "She is my sister" 回答的是人的身份。',
      '询问“谁”要使用疑问词 Who。',
      'Where 问地点，What 问事物/职业，When 问时间。'
    ],
    trapNotice: '看清答句回答的是人物（sister），选择对应的疑问词 Who。',
    bridgeTip: '衔接四年级特殊疑问句系统梳理。',
    difficulty: 1
  }
];

export const CHAPTERS_DATA: Chapter[] = [
  // --- 1升2 Chapters (数学) ---
  {
    id: 'g1_ch1',
    grade: 'g1_to_g2',
    subject: 'math',
    title: '第1关：计算巧算魔法村',
    subtitle: '100以内退位减法、凑十凑整巧算与乘法初步',
    iconName: 'Calculator',
    description: '掌握加减法巧算技巧，建立凑整与连加转化为乘法的直觉。',
    category: 'calc',
    recommendedLevel: '巩固1年级 -> 衔接2年级',
    themeColor: 'from-amber-500 to-orange-500',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g1_to_g2' && (q.subject === 'math' || !q.subject) && (q.chapterId === 'g1_ch1' || q.category === 'calc'))
  },
  {
    id: 'g1_ch2',
    grade: 'g1_to_g2',
    subject: 'math',
    title: '第2关：应用题生活大本营',
    subtitle: '排队计数、人民币买东西、时间与移多补少',
    iconName: 'ShoppingBag',
    description: '结合生活实际，掌握排队问题、购物找零与时间算式。',
    category: 'word',
    recommendedLevel: '巩固1年级 -> 衔接2年级',
    themeColor: 'from-emerald-500 to-teal-600',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g1_to_g2' && (q.subject === 'math' || !q.subject) && (q.chapterId === 'g1_ch2' || q.category === 'word'))
  },
  {
    id: 'g1_ch3',
    grade: 'g1_to_g2',
    subject: 'math',
    title: '第3关：逻辑推理秘境宝藏',
    subtitle: '天平代换、等差规律与逻辑猜真假',
    iconName: 'Brain',
    description: '锻炼严密的推理逻辑、等量代换与规律识别能力。',
    category: 'logic',
    recommendedLevel: '巩固1年级 -> 衔接2年级',
    themeColor: 'from-indigo-500 to-purple-600',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g1_to_g2' && (q.subject === 'math' || !q.subject) && (q.chapterId === 'g1_ch3' || q.category === 'logic'))
  },
  {
    id: 'g1_ch4',
    grade: 'g1_to_g2',
    subject: 'math',
    title: '第4关：图形空间与几何认识',
    subtitle: '长方形正方形对折、立体积木数一数',
    iconName: 'Compass',
    description: '激发空间几何想象力，提升图形对称与三维感知。',
    category: 'logic',
    recommendedLevel: '巩固1年级 -> 衔接2年级',
    themeColor: 'from-cyan-500 to-blue-600',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g1_to_g2' && (q.subject === 'math' || !q.subject) && q.chapterId === 'g1_ch4')
  },
  {
    id: 'g1_ch5',
    grade: 'g1_to_g2',
    subject: 'math',
    title: '第5关：时间与人民币大冒险',
    subtitle: '钟表认读半时与元角分找零运算',
    iconName: 'Zap',
    description: '生活场景实操，灵活掌握钱数换算与整半时概念。',
    category: 'word',
    recommendedLevel: '巩固1年级 -> 衔接2年级',
    themeColor: 'from-rose-500 to-amber-600',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g1_to_g2' && (q.subject === 'math' || !q.subject) && q.chapterId === 'g1_ch5')
  },

  // --- 3升4 Chapters (数学) ---
  {
    id: 'g3_ch1',
    grade: 'g3_to_g4',
    subject: 'math',
    title: '第1关：多位数与巧算神殿',
    subtitle: '乘法分配律与结合律、除数是两位数的除法',
    iconName: 'Sparkles',
    description: '掌握拆数巧算（25×4、125×8）与四则混合运算顺序。',
    category: 'calc',
    recommendedLevel: '巩固3年级 -> 衔接4年级',
    themeColor: 'from-blue-600 to-cyan-600',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g3_to_g4' && (q.subject === 'math' || !q.subject) && (q.chapterId === 'g3_ch1' || q.category === 'calc'))
  },
  {
    id: 'g3_ch2',
    grade: 'g3_to_g4',
    subject: 'math',
    title: '第2关：高级应用题演练场',
    subtitle: '和差问题、行程追及、组合图形平移面积',
    iconName: 'Compass',
    description: '解决现实生活中的三步复杂应用题，建立代数与图形平移直觉。',
    category: 'word',
    recommendedLevel: '巩固3年级 -> 衔接4年级',
    themeColor: 'from-rose-500 to-pink-600',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g3_to_g4' && (q.subject === 'math' || !q.subject) && (q.chapterId === 'g3_ch2' || q.category === 'word'))
  },
  {
    id: 'g3_ch3',
    grade: 'g3_to_g4',
    subject: 'math',
    title: '第3关：逻辑推理与思维巅峰',
    subtitle: '鸡兔同笼假设法、周期循环与容斥原理',
    iconName: 'Zap',
    description: '冲击沪教版小学数学核心思维高地，解锁高阶逻辑技巧。',
    category: 'logic',
    recommendedLevel: '巩固3年级 -> 衔接4年级',
    themeColor: 'from-violet-600 to-purple-800',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g3_to_g4' && (q.subject === 'math' || !q.subject) && (q.chapterId === 'g3_ch3' || q.category === 'logic'))
  },
  {
    id: 'g3_ch4',
    grade: 'g3_to_g4',
    subject: 'math',
    title: '第4关：分数的初步认识与运算',
    subtitle: '认识几分之几与同分母分数加减法',
    iconName: 'Calculator',
    description: '掌握分数的实际物理意义，熟练应用同分母加减法则。',
    category: 'calc',
    recommendedLevel: '巩固3年级 -> 衔接4年级',
    themeColor: 'from-amber-600 to-yellow-600',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g3_to_g4' && (q.subject === 'math' || !q.subject) && q.chapterId === 'g3_ch4')
  },
  {
    id: 'g3_ch5',
    grade: 'g3_to_g4',
    subject: 'math',
    title: '第5关：位置与方向大冒险',
    subtitle: '东南西北方位判定与平面路线描述',
    iconName: 'Compass',
    description: '学会利用指南针顺时针口诀判断方向与辨认相对位置。',
    category: 'logic',
    recommendedLevel: '巩固3年级 -> 衔接4年级',
    themeColor: 'from-teal-600 to-emerald-700',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g3_to_g4' && (q.subject === 'math' || !q.subject) && q.chapterId === 'g3_ch5')
  },

  // --- 语文 Chapters ---
  {
    id: 'g1_chi_ch1',
    grade: 'g1_to_g2',
    subject: 'chinese',
    title: '第1关：字词音调与古诗乐园',
    subtitle: '易错多音字、近反义词积累与经典古诗背诵',
    iconName: 'BookOpen',
    description: '积累小学核心字词音调，赏析名家古诗优美意境。',
    category: 'chinese_vocab',
    recommendedLevel: '巩固1年级 -> 衔接2年级',
    themeColor: 'from-emerald-500 to-green-600',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g1_to_g2' && q.subject === 'chinese' && (q.chapterId === 'g1_chi_ch1' || !q.chapterId))
  },
  {
    id: 'g1_chi_ch2',
    grade: 'g1_to_g2',
    subject: 'chinese',
    title: '第2关：量词积累与成语词汇',
    subtitle: '准确量词搭配与常用反义词辨析',
    iconName: 'BookOpen',
    description: '丰富好词好句储备，提高看图说话与词语运用精准度。',
    category: 'chinese_vocab',
    recommendedLevel: '巩固1年级 -> 衔接2年级',
    themeColor: 'from-teal-500 to-emerald-600',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g1_to_g2' && q.subject === 'chinese' && q.chapterId === 'g1_chi_ch2')
  },
  {
    id: 'g3_chi_ch1',
    grade: 'g3_to_g4',
    subject: 'chinese',
    title: '第1关：修辞手法与经典阅读',
    subtitle: '比喻/拟人/夸张辨析与古诗阅读能力培养',
    iconName: 'BookOpen',
    description: '提高修辞赏析与段落阅读核心理解能力。',
    category: 'chinese_reading',
    recommendedLevel: '巩固3年级 -> 衔接4年级',
    themeColor: 'from-teal-500 to-emerald-700',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g3_to_g4' && q.subject === 'chinese' && (q.chapterId === 'g3_chi_ch1' || !q.chapterId))
  },
  {
    id: 'g3_chi_ch2',
    grade: 'g3_to_g4',
    subject: 'chinese',
    title: '第2关：病句修改与标点符号',
    subtitle: '成分残缺病句识别与表达规范应用',
    iconName: 'BookOpen',
    description: '掌握成分残缺等常见病句诊断技巧，提升作文语法严密性。',
    category: 'chinese_reading',
    recommendedLevel: '巩固3年级 -> 衔接4年级',
    themeColor: 'from-emerald-600 to-teal-800',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g3_to_g4' && q.subject === 'chinese' && q.chapterId === 'g3_chi_ch2')
  },

  // --- 英语 Chapters ---
  {
    id: 'g1_eng_ch1',
    grade: 'g1_to_g2',
    subject: 'english',
    title: '第1关：魔法冠词与基础交际',
    subtitle: 'a/an 正确搭配与 Greeting 口语练习',
    iconName: 'Globe',
    description: '培养自然拼读感与日常场景沟通表达。',
    category: 'english_vocab',
    recommendedLevel: '巩固1年级 -> 衔接2年级',
    themeColor: 'from-sky-500 to-blue-600',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g1_to_g2' && q.subject === 'english' && (q.chapterId === 'g1_eng_ch1' || !q.chapterId))
  },
  {
    id: 'g1_eng_ch2',
    grade: 'g1_to_g2',
    subject: 'english',
    title: '第2关：日常词汇与生活表达',
    subtitle: '方位介词 under/in/on 与 food/drink 词汇',
    iconName: 'Globe',
    description: '在真实情景中提升英语表达兴致与物品词汇掌握。',
    category: 'english_vocab',
    recommendedLevel: '巩固1年级 -> 衔接2年级',
    themeColor: 'from-blue-500 to-indigo-600',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g1_to_g2' && q.subject === 'english' && q.chapterId === 'g1_eng_ch2')
  },
  {
    id: 'g3_eng_ch1',
    grade: 'g3_to_g4',
    subject: 'english',
    title: '第1关：核心时态与语法训练',
    subtitle: '现在进行时/一般现在时与人称代词',
    iconName: 'Globe',
    description: '强化基本语法结构与语境表达准确度。',
    category: 'english_grammar',
    recommendedLevel: '巩固3年级 -> 衔接4年级',
    themeColor: 'from-cyan-500 to-blue-700',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g3_to_g4' && q.subject === 'english' && (q.chapterId === 'g3_eng_ch1' || !q.chapterId))
  },
  {
    id: 'g3_eng_ch2',
    grade: 'g3_to_g4',
    subject: 'english',
    title: '第2关：特殊疑问句与情景交际',
    subtitle: 'Who / Where / What 疑问句辨析与对话应用',
    iconName: 'Globe',
    description: '锻炼在具体生活场景中的对话问答与词汇理解能力。',
    category: 'english_grammar',
    recommendedLevel: '巩固3年级 -> 衔接4年级',
    themeColor: 'from-blue-600 to-cyan-700',
    questions: QUESTIONS_DATABASE.filter(q => q.grade === 'g3_to_g4' && q.subject === 'english' && q.chapterId === 'g3_eng_ch2')
  }
];

export const INITIAL_BADGES = [
  {
    id: 'badge_calc_master',
    title: '巧算小超人',
    description: '在计算与巧算关卡中斩获满分',
    icon: '🧮',
    conditionDescription: '完成计算题库',
    unlocked: false
  },
  {
    id: 'badge_logic_detective',
    title: '逻辑大侦探',
    description: '解开全部逻辑推理难题',
    icon: '🔍',
    conditionDescription: '完成逻辑题库',
    unlocked: false
  },
  {
    id: 'badge_shanghai_scholar',
    title: '上海数学小学霸',
    description: '星级累积超过 10 颗星',
    icon: '🎓',
    conditionDescription: '积累10颗关卡星星',
    unlocked: false
  },
  {
    id: 'badge_perfect_clear',
    title: '满分通关王',
    description: '全关卡以三星成绩完美完美通关',
    icon: '🏆',
    conditionDescription: '获得15颗以上星星',
    unlocked: false
  }
];

export const SHOP_ITEMS = [
  {
    id: 'item_hat_wizard',
    name: '学霸魔法帽',
    type: 'hat' as const,
    cost: 50,
    icon: '🧙‍♂️',
    description: '戴上它，算力增加 100%！'
  },
  {
    id: 'item_glasses_detective',
    name: '逻辑侦探眼镜',
    type: 'glasses' as const,
    cost: 80,
    icon: '👓',
    description: '看清题目里的每一个隐藏陷阱。'
  },
  {
    id: 'item_pet_cookie',
    name: '智慧能量饼干',
    type: 'pet_food' as const,
    cost: 30,
    icon: '🍪',
    description: '喂养你的数学小宠物，提升经验等级！'
  },
  {
    id: 'item_crown_gold',
    name: '暑期数学小冠军皇冠',
    type: 'hat' as const,
    cost: 150,
    icon: '👑',
    description: '尊贵闪耀的沪教数学荣誉徽章！'
  }
];
