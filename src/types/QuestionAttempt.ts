import type { AlternativeAttempt } from "./AlternativeAttempt"
export interface QuestionAttempt {
    type: string
    questionText: string
    mediaUrl: string
    points: number
    alternatives?: AlternativeAttempt[]
    userAnswer?: boolean
    correctAnswer?: boolean
  }
  