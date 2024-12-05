import { QuizQuestion } from '../types/quiz';

// Helper function to validate interactive answers
const validateWithinTolerance = (value: number, target: number, tolerance: number): boolean => {
  return Math.abs(value - target) <= tolerance;
};

export const quizQuestions: Record<string, QuizQuestion> = {
  // Theoretical Questions - Easy
  t1: {
    id: 't1',
    type: 'theoretical',
    text: "What happens to a beam's deflection when the applied force is doubled?",
    options: [
      "Deflection doubles",
      "Deflection quadruples",
      "Deflection remains the same",
      "Deflection increases but not proportionally"
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    topic: 'mechanics',
    explanation: "According to beam theory, deflection is directly proportional to the applied force when within the elastic limit.",
    timesShown: 0,
    maxShows: 2,
    nextQuestions: {
      correct: ['t2', 'i1'],
      incorrect: ['t3']
    }
  },
  t2: {
    id: 't2',
    type: 'theoretical',
    text: "How does Young's Modulus affect beam deformation?",
    options: [
      "Higher modulus increases deformation",
      "Higher modulus decreases deformation",
      "Modulus has no effect on deformation",
      "Effect depends on beam material only"
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'materials',
    explanation: "Young's Modulus is inversely proportional to deformation - stiffer materials (higher E) deform less under the same load.",
    timesShown: 0,
    maxShows: 2,
    nextQuestions: {
      correct: ['i2'],
      incorrect: ['t4']
    }
  },
  // More theoretical questions would be added here...

  // Interactive Questions - Easy
  i1: {
    id: 'i1',
    type: 'interactive',
    text: "Adjust the force to create a deflection equivalent to 5mm at the beam's end.",
    difficulty: 'easy',
    topic: 'forces',
    targetForce: 150,
    tolerance: {
      force: 10
    },
    explanation: "The force required depends on the beam's properties and follows the beam deflection equation.",
    timesShown: 0,
    maxShows: 2,
    validateAnswer: (force: number) => validateWithinTolerance(force, 150, 10),
    nextQuestions: {
      correct: ['i2', 't5'],
      incorrect: ['t2']
    }
  },
  i2: {
    id: 'i2',
    type: 'interactive',
    text: "Set the material properties to match steel (Young's modulus ≈ 200 GPa) and observe the deflection under 100N force.",
    difficulty: 'easy',
    topic: 'materials',
    targetElasticModulus: 200,
    tolerance: {
      elasticModulus: 5
    },
    explanation: "Steel's high Young's modulus makes it resistant to deformation, showing smaller deflections under the same load.",
    timesShown: 0,
    maxShows: 2,
    validateAnswer: (_, elasticModulus: number) => validateWithinTolerance(elasticModulus, 200, 5),
    nextQuestions: {
      correct: ['t6', 'i3'],
      incorrect: ['i1']
    }
  }
  // More interactive questions would be added here...
};