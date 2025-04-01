describe('Dashboard Page Tests', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/dashboard', {
        statusCode: 200,
        body: {
          data: ['Item 1', 'Item 2', 'Item 3'],
        },
      }).as('getDashboardData');
  
      cy.visit('/');
    });
  
    it('should display a loading indicator while data is being fetched', () => {
      cy.get('.loading-spinner').should('be.visible');
      cy.wait('@getDashboardData');
      cy.get('.loading-spinner').should('not.exist');
    });
  
    it('should display the correct data in the dashboard', () => {
      cy.wait('@getDashboardData');
      cy.get('.dashboard-item').should('have.length', 3);
      cy.get('.dashboard-item').first().should('contain', 'Item 1');
    });
  
    it('should show an error message if the dashboard data fails to load', () => {
      cy.intercept('GET', '/api/dashboard', {
        statusCode: 500,
        body: { error: 'Failed to fetch data' },
      }).as('getDashboardDataFail');
  
      cy.visit('/');
      cy.wait('@getDashboardDataFail');
  
      cy.contains('Failed to fetch data').should('be.visible');
    });
  });
  