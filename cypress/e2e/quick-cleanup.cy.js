/// <reference types="cypress" />

describe('Quick Cleanup - Daily Use', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    cy.url().should('include', '/admin')
  })

  it('Quick cleanup automation users', () => {
    cy.visit('http://127.0.0.1:8000/users')
    
    // Handle confirmation dialogs automatically
    cy.on('window:confirm', () => true)
    
    // Find and delete all UAT users
    cy.get('[data-cy="users-table"] tbody tr').each(($row) => {
      const name = $row.find('td:nth-child(2)').text().trim()
      const email = $row.find('td:nth-child(3)').text().trim()
      
      // Check if this is an automation user
      if (name.includes('UAT') || email.includes('uat_')) {
        cy.log(`Deleting: ${name} (${email})`)
        
        // Delete the user
        cy.wrap($row).within(() => {
          cy.get('[data-cy="user-delete"]').click()
        })
        
        // Small wait to prevent race conditions
        cy.wait(300)
      }
    })
    
    cy.log('Quick cleanup completed!')
    
    // Verify cleanup
    cy.reload()
    cy.get('[data-cy="users-table"]').should('be.visible')
    cy.get('[data-cy="users-table"] tbody tr').should(($rows) => {
      let uatUsers = 0
      $rows.each((index, row) => {
        const $row = Cypress.$(row)
        const name = $row.find('td:nth-child(2)').text().trim()
        if (name.includes('UAT')) {
          uatUsers++
        }
      })
      expect(uatUsers).to.equal(0)
    })
  })
})
