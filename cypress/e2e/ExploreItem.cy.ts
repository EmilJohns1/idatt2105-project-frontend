describe('Explore Component', () => {
    beforeEach(() => {
        cy.visit('https://localhost:4173/explore')
    })
  
    it('should render the component', () => {
        cy.get('h1').should('be.visible')
        cy.get('input[type="text"]').should('be.visible')
    })
  
    it('should filter categories based on search input', () => {
        cy.get('input[type="text"]').as('searchBox')
        cy.get('@searchBox').type('All')
        cy.get('h3').contains('All').should('be.visible')
    })
  
    it('should navigate to the selected category on card click', () => {
        const categoryName = 'All' 
        cy.get('h3').contains(categoryName).click()
        cy.url().should('include', `/explore/${categoryName.toLowerCase()}`)
    })
})