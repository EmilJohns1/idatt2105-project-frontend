import type { Alternative } from "./Alternative"
export interface QuestionAttempt {
    type: string
    questionText: string
    mediaUrl: string
    points: number
    alternatives?: Alternative[]
    userAnswer?: boolean
    correctAnswer?: boolean
  }
  