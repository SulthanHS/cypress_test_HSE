describe('UAT Safety Officer Inventory Management 6-10', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('rendiando12@gmail.com')
    cy.get('#password').type('rendi123')
    cy.get('form').submit()
    cy.url().should('include', '/safety-officer')
  })

  it('UAT-SO-006: View Inventory List', () => {
    cy.visit('http://127.0.0.1:8000/inventory')
    cy.get('body').should('contain', 'Equipment Inventory')
    cy.get('table').should('be.visible')
    cy.get('thead').should('contain', 'Equipment Name')
    cy.get('thead').should('contain', 'Status')
  })

  it('UAT-SO-007: Update Equipment Status', () => {
    cy.visit('http://127.0.0.1:8000/inventory')
    
    // Click Update Status button on first equipment
    cy.get('tbody tr').first().within(() => {
      cy.get('button').contains('Update Status').click()
    })
    
    // Verify status modal appears
    cy.get('#updateStatusModal').should('be.visible')
    
    // Change status to Maintenance
    cy.get('#status_maintenance').check()
    cy.get('#updateStatusModal button[type="submit"]').click()
    
    // Verify success message
    cy.get('.alert-success').should('contain', 'updated successfully')
  })

  it('UAT-SO-008: Delete Equipment Unit', () => {
    cy.visit('http://127.0.0.1:8000/inventory')
    
    // Get first equipment unit for deletion
    cy.get('tbody tr').first().within(() => {
      cy.get('[data-cy="inventory-delete"]').click()
    })
    
    // Verify delete modal appears
    cy.get('#deleteModal').should('be.visible')
    cy.get('#deleteModal').should('contain', 'Are you sure you want to delete')
    
    // Confirm deletion
    cy.get('#deleteModal button[type="submit"]').click()
    
    // Verify success message
    cy.get('.alert-success').should('contain', 'deleted successfully')
  })

  it('UAT-SO-009: Filter Inventory by Category', () => {
    cy.visit('http://127.0.0.1:8000/inventory')
    
    // Search for specific category
    cy.get('input[name="search"]').type('Helm')
    cy.get('button').contains('Filter').click()
    
    // Verify filtered results contain Helm
    cy.get('tbody tr').should('contain', 'Helm')
  })

  it('UAT-SO-010: Bulk Status Update', () => {
    cy.visit('http://127.0.0.1:8000/inventory')
    
    // Update status of first equipment
    cy.get('tbody tr').first().within(() => {
      cy.get('button').contains('Update Status').click()
    })
    
    // Change to In Use status
    cy.get('#status_in_use').check()
    cy.get('#updateStatusModal button[type="submit"]').click()
    
    // Verify status changed
    cy.get('.alert-success').should('contain', 'updated successfully')
    
    // Verify status badge shows In Use
    cy.get('tbody tr').first().find('.badge').should('contain', 'In Use')
  })
})
