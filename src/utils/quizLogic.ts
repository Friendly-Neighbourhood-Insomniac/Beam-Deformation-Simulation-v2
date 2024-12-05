import { QuizQuestion, QuestionType, QuestionDifficulty, QuestionTopic } from '../types/quiz';
import { quizQuestions } from '../data/quizQuestions';

export class QuizManager {
  private questions: Map<string, QuizQuestion>;
  private answeredQuestions: Map<string, boolean>;
  private currentDifficulty: Record<QuestionTopic, QuestionDifficulty>;
  private questionCount: number;
  private maxQuestions: number;

  constructor() {
    this.questions = new Map(Object.entries(quizQuestions));
    this.answeredQuestions = new Map();
    this.currentDifficulty = {
      mechanics: 'easy',
      materials: 'easy',
      forces: 'easy',
      deformation: 'easy'
    };
    this.questionCount = 0;
    this.maxQuestions = 15;
  }

  private getNextQuestionId(currentQuestion: QuizQuestion, wasCorrect: boolean): string | null {
    const possibleNextQuestions = wasCorrect 
      ? currentQuestion.nextQuestions?.correct 
      : currentQuestion.nextQuestions?.incorrect;

    if (!possibleNextQuestions?.length) return null;

    // Filter out questions that have been shown maximum times
    const validQuestions = possibleNextQuestions.filter(id => {
      const question = this.questions.get(id);
      return question && question.timesShown < question.maxShows;
    });

    if (!validQuestions.length) return null;

    // Prioritize questions of appropriate difficulty and mix of theoretical/interactive
    const currentType = currentQuestion.type;
    const preferredQuestions = validQuestions.filter(id => {
      const question = this.questions.get(id);
      return question && 
             question.difficulty === this.currentDifficulty[question.topic] &&
             question.type !== currentType; // Alternate between theoretical and interactive
    });

    const candidates = preferredQuestions.length ? preferredQuestions : validQuestions;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  public getNextQuestion(currentQuestionId: string | null, wasCorrect?: boolean): QuizQuestion | null {
    if (this.questionCount >= this.maxQuestions) return null;

    if (currentQuestionId) {
      const currentQuestion = this.questions.get(currentQuestionId);
      if (!currentQuestion) return null;

      // Update difficulty if answer was correct
      if (wasCorrect && this.currentDifficulty[currentQuestion.topic] !== 'hard') {
        this.currentDifficulty[currentQuestion.topic] = 
          this.currentDifficulty[currentQuestion.topic] === 'easy' ? 'medium' : 'hard';
      }

      const nextId = this.getNextQuestionId(currentQuestion, wasCorrect!);
      if (!nextId) return null;

      const nextQuestion = this.questions.get(nextId);
      if (!nextQuestion) return null;

      nextQuestion.timesShown++;
      this.questionCount++;
      return nextQuestion;
    }

    // First question
    const easyQuestions = Array.from(this.questions.values())
      .filter(q => q.difficulty === 'easy' && q.timesShown === 0);
    const firstQuestion = easyQuestions[Math.floor(Math.random() * easyQuestions.length)];
    firstQuestion.timesShown++;
    this.questionCount++;
    return firstQuestion;
  }

  public getProgress(): number {
    return (this.questionCount / this.maxQuestions) * 100;
  }

  public canContinue(): boolean {
    return this.questionCount < this.maxQuestions;
  }
}