describe('DemoHSE Login Tests', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('http://127.0.0.1:8000/login')
  })

  it('should successfully login with admin credentials and redirect to admin dashboard', () => {
    // Fill in the login form with admin credentials
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    
    // Submit the form
    cy.get('form').submit()
    
    // Verify successful login by checking redirect to admin dashboard
    cy.url().should('include', '/admin')
    
    // Check for admin dashboard elements
    cy.get('body').should('contain', 'Admin')
  })

  it('should show error message with invalid credentials', () => {
    // Fill in the login form with invalid credentials
    cy.get('#email').type('invalid@example.com')
    cy.get('#password').type('wrongpassword')
    
    // Submit the form
    cy.get('form').submit()
    
    // Verify error message is displayed (Laravel validation message)
    cy.get('.alert-danger').should('be.visible')
    cy.get('.alert-danger').should('contain', 'Email atau password salah')
  })

  it('should validate required fields', () => {
    // Try to submit empty form
    cy.get('form').submit()
    
    // Check that form validation prevents submission
    cy.url().should('include', '/login')
  })

  it('should login and access admin dashboard features', () => {
    // Login with admin credentials
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    
    // Verify we're on the admin dashboard
    cy.url().should('include', '/admin')
    
    // Check for admin-specific navigation elements
    cy.get('body').should('contain', 'Admin')
    
    // Optional: Check for admin menu items if they exist
    // cy.get('nav').should('contain', 'Users')
    // cy.get('nav').should('contain', 'Equipment')
    // cy.get('nav').should('contain', 'Inventory')
  })

  it('should handle logout functionality', () => {
    // First login
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    
    // Verify we're logged in
    cy.url().should('include', '/admin')
    
    // Find and click logout button/link
    // This might need adjustment based on your actual logout implementation
    cy.get('a[href*="logout"], button[onclick*="logout"], form[action*="logout"]').first().click()
    
    // Verify we're redirected back to login page
    cy.url().should('include', '/login')
  })

  it('should test different user roles login', () => {
    // Test admin login
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    
    // Verify admin redirect
    cy.url().should('include', '/admin')
    
    // Logout
    cy.visit('http://127.0.0.1:8000/login')
    
    // Note: You can add tests for other user roles if you have test data
    // For example: supervisor, safety-officer, operator
  })
})