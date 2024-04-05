import type { Alternative } from './Alternative'
export interface Question {
  questionText: string
  mediaUrl: string
  points: number
  type?: string
  alternatives?: Alternative[]
  correctAnswer?: boolean
}
