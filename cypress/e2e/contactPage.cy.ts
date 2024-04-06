describe('ContactPage Component', () => {
    beforeEach(() => {
      // Assuming your app runs on localhost:3000
      cy.visit('https://localhost:4173/contact')
    })
  
    it('should render the form', () => {
      cy.get('form').should('be.visible')
    })
  
    it('should allow user to input first name', () => {
      cy.get('input[id="firstName"]').type('Test')
      cy.get('input[id="firstName"]').should('have.value', 'Test')
    })
  
    it('should allow user to input last name', () => {
      cy.get('input[id="lastName"]').type('User')
      cy.get('input[id="lastName"]').should('have.value', 'User')
    })
  
    it('should allow user to input email', () => {
      cy.get('input[id="email"]').type('test@example.com')
      cy.get('input[id="email"]').should('have.value', 'test@example.com')
    })
  
    it('should allow user to select feedback type', () => {
      cy.get('select[id="feedbackType"]').select('FEEDBACK')
      cy.get('select[id="feedbackType"]').should('have.value', 'FEEDBACK')
    })
  
    it('should allow user to input content', () => {
      cy.get('textarea[id="content"]').type('This is a test feedback')
      cy.get('textarea[id="content"]').should('have.value', 'This is a test feedback')
    })
  })