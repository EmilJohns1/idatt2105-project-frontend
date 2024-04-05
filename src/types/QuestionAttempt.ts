import type { AlternativeRecord } from './AlternativeRecord'
export interface QuestionAttempt {
  type: string
  questionText: string
  mediaUrl: string
  points: number
  alternatives?: AlternativeRecord[]
  userAnswer?: boolean
  correctAnswer?: boolean
}
