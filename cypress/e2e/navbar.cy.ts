

describe('NavBar Component', () => {
  
    beforeEach(() => {
      cy.visit('https://localhost:4173')
    })
  
    it('should navigate to home page when logo is clicked', () => {
      cy.get('#logo').click()
      cy.url().should('include', '/')
    })
  
    it('should navigate to explore page', () => {
      cy.get('a.link').contains('Explore').click()
      cy.url().should('include', '/explore')
    })
  
    it('should navigate to contact page', () => {
      cy.get('a.link').contains('Contact').click()
      cy.url().should('include', '/contact')
    })
  
    it('should navigate to signup page', () => {
      cy.get('a.purpleButton').contains('Sign up').click()
      cy.url().should('include', '/signup')
    })
  })