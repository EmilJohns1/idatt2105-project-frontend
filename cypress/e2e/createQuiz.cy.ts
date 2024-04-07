
describe('CreateQuiz Component', () => {
    beforeEach(() => {
      cy.visit('https://localhost:4173/quiz/create')
    })
  
    it('should redirect to login when not logged in', () => {
      cy.url().should('include', '/login')
    })
  })