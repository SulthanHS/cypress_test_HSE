/// <reference types="cypress" />

describe('Cleanup Automation Test Users', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    cy.url().should('include', '/admin')
  })

  it('Cleanup all UAT automation users', () => {
    cy.visit('http://127.0.0.1:8000/users')
    
    // Wait for users table to load
    cy.get('[data-cy="users-table"]').should('be.visible')
    
    // Get all users and identify automation ones
    cy.get('[data-cy="users-table"] tbody tr').then(($rows) => {
      const automationUsers = []
      
      $rows.each((index, row) => {
        const $row = Cypress.$(row)
        const name = $row.find('td:nth-child(2)').text().trim()
        const email = $row.find('td:nth-child(3)').text().trim()
        
        // Check if this is an automation user
        if (name.includes('UAT') || 
            name.includes('Test') || 
            email.includes('uat_') || 
            email.includes('test_') ||
            email.includes('uat_user_') ||
            email.includes('uat_edit_') ||
            email.includes('uat_delete_') ||
            email.includes('uat_count_')) {
          automationUsers.push({ name, email, rowIndex: index })
        }
      })
      
      cy.log(`Found ${automationUsers.length} automation users to cleanup`)
      
      if (automationUsers.length === 0) {
        cy.log('No automation users found - cleanup complete!')
        return
      }
      
      // Delete each automation user
      automationUsers.forEach((user, index) => {
        cy.log(`Deleting user ${index + 1}/${automationUsers.length}: ${user.name} (${user.email})`)
        
        // Find the row again (in case table changed) and delete
        cy.get('[data-cy="users-table"] tbody tr').contains('tr', user.name).within(() => {
          // Check if delete button exists and is not disabled
          cy.get('[data-cy="user-delete"]').should('be.visible').then(($deleteBtn) => {
            if (!$deleteBtn.prop('disabled')) {
              cy.get('[data-cy="user-delete"]').click()
              
              // Handle confirmation dialog
              cy.on('window:confirm', () => true)
              
              // Wait for deletion to complete
              cy.wait(1000)
            } else {
              cy.log(`Cannot delete ${user.name} - button disabled`)
            }
          })
        })
      })
      
      // Verify cleanup
      cy.visit('http://127.0.0.1:8000/users')
      cy.get('[data-cy="users-table"]').should('be.visible')
      
      // Check that no automation users remain
      cy.get('[data-cy="users-table"] tbody tr').then(($rows) => {
        let remainingAutomationUsers = 0
        
        $rows.each((index, row) => {
          const $row = Cypress.$(row)
          const name = $row.find('td:nth-child(2)').text().trim()
          const email = $row.find('td:nth-child(3)').text().trim()
          
          if (name.includes('UAT') || 
              name.includes('Test') || 
              email.includes('uat_') || 
              email.includes('test_')) {
            remainingAutomationUsers++
          }
        })
        
        cy.log(`Cleanup complete! ${remainingAutomationUsers} automation users remaining`)
        expect(remainingAutomationUsers).to.equal(0)
      })
    })
  })

  it('Quick cleanup by email pattern', () => {
    cy.visit('http://127.0.0.1:8000/users')
    
    // Delete users with specific email patterns
    const emailPatterns = [
      'uat_user_',
      'uat_edit_', 
      'uat_delete_',
      'uat_count_',
      'test_',
      'uat_'
    ]
    
    emailPatterns.forEach(pattern => {
      cy.get('body').then(($body) => {
        if ($body.find(`[data-email*="${pattern}"]`).length > 0) {
          cy.log(`Cleaning up users with pattern: ${pattern}`)
          
          cy.get(`[data-email*="${pattern}"]`).each(($emailElement) => {
            const email = $emailElement.text().trim()
            cy.log(`Deleting user with email: ${email}`)
            
            $emailElement.parents('tr').within(() => {
              cy.get('[data-cy="user-delete"]').click()
              cy.on('window:confirm', () => true)
              cy.wait(500)
            })
          })
        }
      })
    })
    
    cy.log('Quick cleanup by email pattern completed')
  })

  it('Force cleanup with retry mechanism', () => {
    cy.visit('http://127.0.0.1:8000/users')
    
    // Retry cleanup up to 3 times
    for (let attempt = 1; attempt <= 3; attempt++) {
      cy.log(`Cleanup attempt ${attempt}/3`)
      
      cy.get('[data-cy="users-table"] tbody tr').then(($rows) => {
        let automationUsersFound = 0
        
        $rows.each((index, row) => {
          const $row = Cypress.$(row)
          const name = $row.find('td:nth-child(2)').text().trim()
          
          if (name.includes('UAT') || name.includes('Test')) {
            automationUsersFound++
            
            // Force delete with retry
            cy.get('[data-cy="users-table"] tbody tr').eq(index).within(() => {
              cy.get('[data-cy="user-delete"]').click({ force: true })
              cy.on('window:confirm', () => true)
            })
          }
        })
        
        if (automationUsersFound === 0) {
          cy.log('No more automation users found - cleanup successful!')
          return
        }
        
        // Wait before next attempt
        if (attempt < 3) {
          cy.wait(2000)
          cy.reload()
        }
      })
    }
    
    cy.log('Force cleanup with retry completed')
  })
})
