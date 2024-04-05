import type { QuestionAttempt } from './QuestionAttempt'
export interface QuizAttemptRequest {
  title: string
  id?: number
  attemptTime?:string
  score: number
  userId: number
  quizId: number
  questionAttempts: QuestionAttempt[]
}
