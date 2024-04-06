import {
  addQuestionToQuiz,
  updateTrueOrFalseQuestion,
  addAlternativeToQuestion
} from '@/api/questionHooks'
import type { Question } from '@/types/Question'

export async function handleImport(file: File, quizId: number): Promise<boolean> {
  const reader = new FileReader()

  reader.onload = async (event) => {
    const text = event.target?.result as string
    const questions = parseFile(text)

    for (const question of questions) {
      if (question.type === 'true or false') {
        question.type = 'true_or_false'
      } else if (question.type === 'multiple choice') {
        question.type = 'multiple_choice'
      }
      const questionData = {
        questionText: question.questionText,
        points: question.points,
        type: question.type,
        quizId: quizId,
        mediaUrl: question.mediaUrl
      }

      try {
        const newQuestion = await addQuestionToQuiz(questionData)
        if (question.type === 'true_or_false') {
          await updateTrueOrFalseQuestion(newQuestion.id, question.correctAnswer || false)
        } else if (question.type === 'multiple_choice') {
          for (const alternative of question.alternatives ?? []) {
            await addAlternativeToQuestion({
              questionId: newQuestion.id,
              alternativeText: alternative.alternativeText,
              correct: alternative.correct
            })
          }
        }
      } catch (error) {
        false
      }
    }
  }
  reader.readAsText(file)
  return true
}

export function parseFile(text: string): Question[] {
  try {
    const lines = text.split('\n')
    const questions: Question[] = []
    let currentQuestion: Question | null = null

    for (const line of lines) {
      const trimmedLine = line.trim()

      if (trimmedLine.startsWith('Question title: ')) {
        if (currentQuestion) {
          questions.push(currentQuestion)
        }
        currentQuestion = {
          questionText: trimmedLine.substring('Question title: '.length).trim(),
          points: 0,
          mediaUrl: '',
          type: ''
        }
      } else if (currentQuestion) {
        if (trimmedLine.startsWith('Max points: ')) {
          currentQuestion.points = parseInt(trimmedLine.substring('Max points: '.length).trim(), 10)
        } else if (trimmedLine.startsWith('Image url: ')) {
          currentQuestion.mediaUrl = trimmedLine.substring('Image url: '.length).trim()
        } else if (trimmedLine.startsWith('Question type: ')) {
          currentQuestion.type = trimmedLine.substring('Question type: '.length).trim()
        } else if (trimmedLine.startsWith('Answer: ')) {
          if (currentQuestion.type === 'true or false') {
            currentQuestion.correctAnswer =
              trimmedLine.substring('Answer: '.length).trim() === 'true'
          }
        } else if (trimmedLine.startsWith('Alternatives:')) {
          currentQuestion.alternatives = []
        } else if (currentQuestion.type === 'multiple choice' && trimmedLine.startsWith('-')) {
          const correct = trimmedLine.includes('(correct)')
          const alternativeText = trimmedLine.replace(/-/, '').replace('(correct)', '').trim()
          if (!currentQuestion.alternatives) {
            currentQuestion.alternatives = []
          }
          currentQuestion.alternatives.push({ alternativeText, correct })
        }
      }
    }

    if (currentQuestion) {
      questions.push(currentQuestion)
    }

    return questions
  } catch (error) {
    throw new Error('Error parsing file. Please ensure the file is in the correct format.')
  }
}
