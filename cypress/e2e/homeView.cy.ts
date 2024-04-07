describe('Home View', () => {
    beforeEach(() => {
      cy.visit('https://localhost:4173')
    })
  
    it('displays the Discover section with categories', () => {
      cy.get('.discover h1').should('contain', 'Discover')
    })
  
    it('navigates to the Sign up page when the Sign up button is clicked', () => {
      cy.get('.signup-button').click()
      cy.url().should('include', '/signup')
    })
  })