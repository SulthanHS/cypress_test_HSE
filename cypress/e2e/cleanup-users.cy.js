describe('Cleanup Test Users', () => {
  beforeEach(() => {
    // Login as admin
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    cy.url().should('include', '/admin')
  })

  it('should remove all test users', () => {
    cy.visit('http://127.0.0.1:8000/users')
    
    // Function to delete test users
    const deleteTestUsers = () => {
      cy.get('tbody tr').then(($rows) => {
        if ($rows.length === 0) {
          cy.log('No users found to delete')
          return
        }

        let testUserFound = false
        
        $rows.each((index, row) => {
          const $row = Cypress.$(row)
          const email = $row.find('td:nth-child(3)').text().trim()
          const name = $row.find('td:nth-child(2)').text().trim()
          
          // Check if it's a test user
          if (email.includes('testuser') || name.includes('Test User') || name.includes('Updated User Name')) {
            testUserFound = true
            cy.log(`Found test user: ${name} (${email})`)
            
            // Click delete button for this user
            cy.wrap($row).find('form[action*="destroy"] button[type="submit"]').click()
            
            // Handle confirmation dialog
            cy.on('window:confirm', () => true)
            
            // Wait for success message
            cy.get('body').should('contain', 'deleted successfully')
            
            // Reload the page to get updated list
            cy.reload()
            
            // Recursively call to check for more test users
            cy.wait(1000) // Wait for page to load
            deleteTestUsers()
          }
        })
        
        if (!testUserFound) {
          cy.log('No more test users found')
        }
      })
    }
    
    // Start the deletion process
    deleteTestUsers()
  })

  it('should verify cleanup was successful', () => {
    cy.visit('http://127.0.0.1:8000/users')
    
    // Check that no test users remain
    cy.get('tbody tr').each(($row) => {
      const email = $row.find('td:nth-child(3)').text()
      const name = $row.find('td:nth-child(2)').text()
      
      // Verify no test users exist
      expect(email).to.not.include('testuser')
      expect(name).to.not.include('Test User')
      expect(name).to.not.include('Updated User Name')
    })
    
    cy.log('✅ All test users have been successfully removed')
  })
})
