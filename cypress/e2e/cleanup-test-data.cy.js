describe('Cleanup Test Data', () => {
  beforeEach(() => {
    // Login as admin before each test
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    
    // Verify we're on admin dashboard
    cy.url().should('include', '/admin')
  })

  it('should delete test users created during testing', () => {
    cy.visit('http://127.0.0.1:8000/users')
    
    // Delete users with test email pattern
    cy.get('tbody tr').each(($row) => {
      const email = $row.find('td:nth-child(3)').text() // Email column
      const name = $row.find('td:nth-child(2)').text() // Name column
      
      // Check if it's a test user (contains 'testuser' in email or 'Test User' in name)
      if (email.includes('testuser') || name.includes('Test User') || name.includes('Updated User Name')) {
        // Find the delete button in this row
        cy.wrap($row).find('button[type="submit"]').click()
        
        // Confirm deletion (if there's a confirmation dialog)
        cy.on('window:confirm', () => true)
        
        // Wait for the page to reload
        cy.url().should('include', '/users')
        
        // Verify the user was deleted
        cy.get('body').should('not.contain', email)
      }
    })
  })

  it('should delete specific test user by email', () => {
    cy.visit('http://127.0.0.1:8000/users')
    
    // Look for specific test user
    cy.get('tbody tr').each(($row) => {
      const email = $row.find('td:nth-child(3)').text()
      
      if (email.includes('testuser') && email.includes('@example.com')) {
        // Click delete button for this specific user
        cy.wrap($row).find('form[action*="destroy"] button[type="submit"]').click()
        
        // Handle confirmation dialog
        cy.on('window:confirm', () => true)
        
        // Wait for redirect and verify deletion
        cy.url().should('include', '/users')
        cy.get('body').should('contain', 'deleted successfully')
      }
    })
  })

  it('should verify no test users remain', () => {
    cy.visit('http://127.0.0.1:8000/users')
    
    // Verify no test users are present
    cy.get('tbody tr').each(($row) => {
      const email = $row.find('td:nth-child(3)').text()
      const name = $row.find('td:nth-child(2)').text()
      
      // Assert that no test users remain
      cy.wrap(email).should('not.include', 'testuser')
      cy.wrap(name).should('not.include', 'Test User')
    })
  })
})
