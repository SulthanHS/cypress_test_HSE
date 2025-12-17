describe('Admin Dashboard Tests', () => {
  beforeEach(() => {
    // Login as admin before each test
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    
    // Verify we're on admin dashboard
    cy.url().should('include', '/admin')
  })

  it('should access user management section', () => {
    // Navigate to users page
    cy.visit('http://127.0.0.1:8000/users')
    
    // Verify we're on users page
    cy.url().should('include', '/users')
    cy.get('body').should('contain', 'User Management')
  })

  it('should access equipment purchase section', () => {
    // Navigate to equipment page
    cy.visit('http://127.0.0.1:8000/equipment')
    
    // Verify we're on equipment page
    cy.url().should('include', '/equipment')
    cy.get('body').should('contain', 'Equipment')
  })

  it('should access inventory section', () => {
    // Navigate to inventory page
    cy.visit('http://127.0.0.1:8000/inventory')
    
    // Verify we're on inventory page
    cy.url().should('include', '/inventory')
    cy.get('body').should('contain', 'Inventory')
  })

  it('should access problem reports section', () => {
    // Navigate to problems page
    cy.visit('http://127.0.0.1:8000/problems')
    
    // Verify we're on problems page
    cy.url().should('include', '/problems')
    cy.get('body').should('contain', 'Problem')
  })

  it('should not access operator reports section (admin not allowed)', () => {
    // Try to access reports page - should get 403
    cy.visit('http://127.0.0.1:8000/reports', { failOnStatusCode: false })
    
    // Should get 403 Forbidden
    cy.get('body').should('contain', 'Unauthorized access')
  })
})
