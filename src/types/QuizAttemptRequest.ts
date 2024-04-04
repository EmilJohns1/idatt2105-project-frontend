import type { QuestionAttempt } from "./QuestionAttempt"
export interface QuizAttemptRequest {
    score: number,
    userId: number,
    quizId: number,
    questionAttempts: QuestionAttempt[]
  }
  