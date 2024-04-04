import type { UserDto } from '@/types/UserDto'
import type { Tag } from '@/types/Tag'

export interface QuizDto {
  id: number
  title: string
  description: string
  quizPictureUrl?: string
  categoryName: string
  creationDate: string
  lastModifiedDate?: string
  userDTOs: UserDto[]
  tags: Tag[]
  public: boolean
  randomizedOrder: boolean
  authorId: number
}
