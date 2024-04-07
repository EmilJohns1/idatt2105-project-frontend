

describe('CreateQuiz Component', () => {
    beforeEach(() => {
      cy.visit('https://localhost:4173/quiz/create')
    })
  
    it('should render the form', () => {
      cy.get('form').should('be.visible')
    })
  
    it('should allow user to input quiz title', () => {
      cy.get('input[class="input-field"]').type('Test Quiz')
      cy.get('input[class="input-field"]').should('have.value', 'Test Quiz')
    })
  
    it('should allow user to input quiz description', () => {
      cy.get('textarea[class="input-field description"]').type('This is a test quiz')
      cy.get('textarea[class="input-field description"]').should('have.value', 'This is a test quiz')
    })
  
    it('should allow user to add tags', () => {
      cy.get('input[id="input-tag"]').type('tag1')
      cy.get('button').contains('Create tag').click()
      cy.get('ul[id="tags"]').should('contain', 'tag1')
    })
  })