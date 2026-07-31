export type GradeLevel = 'g1_to_g2' | 'g3_to_g4';

export type Subject = 'math' | 'chinese' | 'english';

export type QuestionCategory = 'calc' | 'word' | 'logic' | 'multiplication_table' | 'chinese_vocab' | 'chinese_reading' | 'english_vocab' | 'english_grammar' | 'english_reading';

export interface Question {
  id: string;
  grade: GradeLevel;
  subject?: Subject; // 学科：math / chinese / english
  chapterId: string; // e.g. 'ch1', 'ch2'
  category: QuestionCategory;
  title: string;
  subtitle?: string;
  expression?: string; // For math formulas or language passages
  diagramType?: 'bar' | 'shapes' | 'queue' | 'clock' | 'area' | 'cycle' | 'passage'; // Visual diagram trigger
  diagramData?: any;
  options: string[];
  correctIndex: number;
  keyPoint: string; // 考点定位
  steps: string[]; // 详细思维拆解过程
  trapNotice: string; // 易错陷阱提醒
  bridgeTip: string; // 巩固旧知与衔接新课总结
  difficulty: 1 | 2 | 3; // 难度系数
}

export interface Chapter {
  id: string;
  grade: GradeLevel;
  subject?: Subject;
  title: string;
  subtitle: string;
  iconName: string;
  description: string;
  category: QuestionCategory | 'mixed';
  recommendedLevel: string;
  themeColor: string;
  questions: Question[];
}

export interface UserProgress {
  selectedGrade: GradeLevel;
  selectedSubject: Subject;
  studentName: string;
  goldCoins: number;
  starsCount: number;
  unlockedChapters: string[]; // Chapter IDs
  chapterStars: Record<string, number>; // chapterId -> stars (0-3)
  completedQuestions: Record<string, number>; // questionId -> selectedIndex
  mistakes: string[]; // Array of question IDs currently incorrect
  examHistory: ExamResult[];
  petLevel: number;
  petName: string;
  petExp: number;
  ownedEquipment: string[]; // IDs of equipped hats/glasses
  equippedHat: string | null;
  badges: string[]; // Unlocked badge IDs
  dailyStreakDays: number;
  lastPracticeDate: string;
}

export interface ExamResult {
  id: string;
  date: string;
  grade: GradeLevel;
  subject: Subject | 'all';
  score: number;
  totalQuestions: number;
  correctCount: number;
  usedTimeSeconds: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  conditionDescription: string;
  unlocked: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'hat' | 'glasses' | 'badge' | 'pet_food';
  cost: number;
  icon: string;
  description: string;
}
