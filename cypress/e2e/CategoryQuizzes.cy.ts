describe('CategoryQuizzes Component', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('https://localhost:4173/explore/math')
    })
});
describe('CategoryQuizzes Component - All Category', () => {
    beforeEach(() => {
        
        cy.visit('https://localhost:4173/explore/all')
    })
  
    it('should render the component with initial quizzes', () => {
        cy.get('.category-quizzes-container').should('be.visible')
        cy.get('.grid-layout').find('.card-item').should('have.length.at.least', 1)
    })
    
    it('should navigate through pagination', () => {
        cy.intercept('GET', '**/quizzes**').as('fetchQuizzes');
        cy.wait('@fetchQuizzes'); 
        cy.get('.pagination-controls').contains('2').click();
        cy.wait('@fetchQuizzes');
        cy.get('.grid-layout .card-item').should('have.length.at.least', 2); 
    });
});

describe('CategoryQuizzes Component - Category Title Verification', () => {
    const categories = [
      { path: 'all', title: 'All' },
      { path: 'math', title: 'Math' },
      { path: 'science', title: 'Science' },
    ];
  
    categories.forEach((category) => {
      it(`should display title correctly for the ${category.title} category`, () => {
        cy.visit(`https://localhost:5173/explore/${category.path}`);
        
        cy.get('.header h1').should('contain', category.title);
      });
    });
  });