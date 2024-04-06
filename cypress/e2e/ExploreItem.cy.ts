describe('Explore Component', () => {
    beforeEach(() => {
        cy.visit('https://localhost:4173/explore')
    })
  
    it('should render the component with initial categories', () => {
        cy.get('.explore-container').should('be.visible')
        cy.get('.grid-layout').find('.card-item').should('have.length.at.least', 1)
    })
  
    it('should filter categories based on search input', () => {
        cy.get('input[type="text"]').as('searchBox')
        cy.get('@searchBox').type('Science')
        cy.get('.grid-layout').find('.card-item').each(($el) => {
            cy.wrap($el).contains('Science')
        })
    })
  
    it('should navigate to the selected category on card click', () => {
        const categoryName = 'Math' 
        cy.get('.grid-layout').contains(categoryName).click()
        cy.url().should('include', `/explore/${categoryName.toLowerCase()}`)
    })
})