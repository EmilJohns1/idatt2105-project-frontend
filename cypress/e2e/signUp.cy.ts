describe('SignUp Component', () => {
    beforeEach(() => {
      // Assuming your app runs on localhost:3000
      cy.visit('https://localhost:4173/signup')
    })
  
    it('should render the form', () => {
      cy.get('form').should('be.visible')
    })
  
    it('should allow user to input email', () => {
      cy.get('input[placeholder="Email"]').type('test@example.com')
      cy.get('input[placeholder="Email"]').should('have.value', 'test@example.com')
    })
  
    it('should allow user to input password', () => {
      cy.get('input[type="password"]').type('password')
      cy.get('input[type="password"]').should('have.value', 'password')
    })
  })