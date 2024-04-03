import type { Alternative } from "./Alternative"
export interface Question {
  questionText: string,
  mediaUrl: string,
  points: number,
  alternatives?: Alternative[],
  correctAnswer?: boolean
}
