import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Award, BookOpen, X, AlertCircle } from 'lucide-react';
import { QuizManager } from '../utils/quizLogic';
import { QuizQuestion, QuizState } from '../types/quiz';

interface QuizPanelProps {
  force: number;
  elasticModulus: number;
  onForceChange: (force: number) => void;
  onElasticModulusChange: (modulus: number) => void;
}

export function QuizPanel({ 
  force, 
  elasticModulus, 
  onForceChange, 
  onElasticModulusChange 
}: QuizPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quizManager] = useState(() => new QuizManager());
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: '',
    answeredQuestions: new Map(),
    correctAnswers: 0,
    totalAttempted: 0,
    questionsRemaining: 15,
    difficulty: {
      mechanics: 'easy',
      materials: 'easy',
      forces: 'easy',
      deformation: 'easy'
    },
    force,
    elasticModulus
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);

  // Initialize first question
  useEffect(() => {
    const firstQuestion = quizManager.getNextQuestion(null);
    if (firstQuestion) {
      setCurrentQuestion(firstQuestion);
      setQuizState(prev => ({ ...prev, currentQuestion: firstQuestion.id }));
    }
  }, []);

  const handleTheoreticalAnswer = useCallback((answerIndex: number) => {
    if (!currentQuestion || currentQuestion.type !== 'theoretical') return;
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    setQuizState(prev => {
      const newAnsweredQuestions = new Map(prev.answeredQuestions);
      newAnsweredQuestions.set(currentQuestion.id, isCorrect);
      
      return {
        ...prev,
        answeredQuestions: newAnsweredQuestions,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        totalAttempted: prev.totalAttempted + 1
      };
    });
  }, [currentQuestion]);

  const handleInteractiveAnswer = useCallback(() => {
    if (!currentQuestion || currentQuestion.type !== 'interactive') return;
    
    const isCorrect = currentQuestion.validateAnswer(force, elasticModulus);
    setShowExplanation(true);
    
    setQuizState(prev => {
      const newAnsweredQuestions = new Map(prev.answeredQuestions);
      newAnsweredQuestions.set(currentQuestion.id, isCorrect);
      
      return {
        ...prev,
        answeredQuestions: newAnsweredQuestions,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        totalAttempted: prev.totalAttempted + 1
      };
    });
  }, [currentQuestion, force, elasticModulus]);

  const nextQuestion = useCallback(() => {
    if (!currentQuestion) return;
    
    const wasCorrect = quizState.answeredQuestions.get(currentQuestion.id);
    const nextQuestion = quizManager.getNextQuestion(currentQuestion.id, wasCorrect);
    
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setQuizState(prev => ({ 
        ...prev, 
        currentQuestion: nextQuestion.id,
        questionsRemaining: 15 - prev.totalAttempted - 1
      }));
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [currentQuestion, quizState.answeredQuestions]);

  const score = quizState.totalAttempted > 0 
    ? Math.round((quizState.correctAnswers / quizState.totalAttempted) * 100) 
    : 0;

  if (!currentQuestion) return null;

  return (
    <>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed left-0 top-1/2 -translate-y-1/2 bg-white px-2 py-4 rounded-r-lg shadow-lg 
          transition-transform duration-300 hover:bg-gray-50 z-20
          ${isExpanded ? 'translate-x-[320px]' : 'translate-x-0'}`}
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      <div className={`fixed left-0 top-0 bottom-0 w-[320px] bg-white shadow-lg transition-transform 
        duration-300 transform z-10 ${isExpanded ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold">Interactive Quiz</h2>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <Award className={`w-5 h-5 ${score >= 70 ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">
                  Score: {score}% ({quizState.correctAnswers}/{quizState.totalAttempted})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${quizManager.getProgress()}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <AlertCircle className={`w-4 h-4 mt-1 flex-shrink-0 
                  ${currentQuestion.type === 'interactive' ? 'text-purple-500' : 'text-blue-500'}`} 
                />
                <p className="font-medium text-gray-800">{currentQuestion.text}</p>
              </div>
              
              {currentQuestion.type === 'theoretical' ? (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleTheoreticalAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-3 text-left rounded-lg text-sm transition-colors
                        ${selectedAnswer === null 
                          ? 'hover:bg-gray-50 border border-gray-200' 
                          : selectedAnswer === index
                            ? index === currentQuestion.correctAnswer
                              ? 'bg-green-100 border border-green-300'
                              : 'bg-red-100 border border-red-300'
                            : index === currentQuestion.correctAnswer
                              ? 'bg-green-100 border border-green-300'
                              : 'bg-gray-50 border border-gray-200'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Force (N)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={force}
                      onChange={(e) => onForceChange(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-sm text-gray-600">
                      {force.toFixed(1)} N
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Young's Modulus (GPa)
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="400"
                      value={elasticModulus}
                      onChange={(e) => onElasticModulusChange(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-sm text-gray-600">
                      {elasticModulus} GPa
                    </div>
                  </div>

                  <button
                    onClick={handleInteractiveAnswer}
                    disabled={showExplanation}
                    className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg 
                      hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Check Answer
                  </button>
                </div>
              )}

              {showExplanation && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{currentQuestion.explanation}</p>
                </div>
              )}

              {showExplanation && quizManager.canContinue() && (
                <button
                  onClick={nextQuestion}
                  className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg 
                    hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Next Question
                </button>
              )}

              {!quizManager.canContinue() && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Quiz completed! {score >= 70 
                      ? "Great job! You've demonstrated a good understanding of beam deformation concepts."
                      : "Review the concepts of elastic deformation and material properties, particularly focusing on the relationship between force, stress, and Young's modulus."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}