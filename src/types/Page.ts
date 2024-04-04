export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  numberOfElements: number
}
