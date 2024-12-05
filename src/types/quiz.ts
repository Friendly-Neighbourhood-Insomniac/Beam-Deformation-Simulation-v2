export type QuestionType = 'theoretical' | 'interactive';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionTopic = 'mechanics' | 'materials' | 'forces' | 'deformation';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  text: string;
  difficulty: QuestionDifficulty;
  topic: QuestionTopic;
  explanation: string;
  timesShown: number;
  maxShows: number;
  nextQuestions?: {
    correct: string[];
    incorrect: string[];
  };
}

export interface TheoreticalQuestion extends BaseQuestion {
  type: 'theoretical';
  options: string[];
  correctAnswer: number;
}

export interface InteractiveQuestion extends BaseQuestion {
  type: 'interactive';
  targetForce?: number;
  targetElasticModulus?: number;
  tolerance: {
    force?: number;
    elasticModulus?: number;
  };
  validateAnswer: (force: number, elasticModulus: number) => boolean;
}

export type QuizQuestion = TheoreticalQuestion | InteractiveQuestion;

export interface QuizState {
  currentQuestion: string;
  answeredQuestions: Map<string, boolean>; // Maps question ID to whether it was answered correctly
  correctAnswers: number;
  totalAttempted: number;
  questionsRemaining: number;
  difficulty: Record<QuestionTopic, QuestionDifficulty>;
  force: number;
  elasticModulus: number;
}