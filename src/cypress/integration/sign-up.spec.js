describe('SignUp Page Tests', () => {
    beforeEach(() => {
      cy.visit('/register');
    });
  
    it('should display validation error for empty fields', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('All fields are required').should('be.visible');
    });
  
    it('should display validation error for password mismatch', () => {
      cy.get('input[name="firstName"]').type('John');
      cy.get('input[name="lastName"]').type('Doe');
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password321');
      cy.get('button[type="submit"]').click();
      cy.contains('Passwords do not match').should('be.visible');
    });
  
    it('should register successfully with valid data', () => {
      cy.intercept('POST', 'https://reqres.in/api/register', {
        statusCode: 200,
        body: {
          id: 1,
          token: 'fake-token',
        },
      }).as('registerRequest');
  
      cy.get('input[name="firstName"]').type('John');
      cy.get('input[name="lastName"]').type('Doe');
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@registerRequest');
  
      cy.url().should('include', '/');
    });
  
    it('should show error message on registration failure', () => {
      cy.intercept('POST', 'https://reqres.in/api/register', {
        statusCode: 400,
        body: {
          error: 'Note: Only defined users succeed registration',
        },
      }).as('registerRequest');
  
      cy.get('input[name="firstName"]').type('John');
      cy.get('input[name="lastName"]').type('Doe');
      cy.get('input[name="email"]').type('invalid.email@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@registerRequest');
  
      cy.contains('Registration failed').should('be.visible');
    });
  });
  