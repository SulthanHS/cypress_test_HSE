describe('UAT Admin Inventory Management 17-20', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    cy.url().should('include', '/admin')
  })

  it('UAT-ADM-017: View Inventory List', () => {
    cy.visit('http://127.0.0.1:8000/inventory')
    cy.get('body').should('contain', 'Equipment Inventory')
    cy.get('table').should('be.visible')
    cy.get('thead').should('contain', 'Equipment Name')
    cy.get('thead').should('contain', 'Status')
  })

  it('UAT-ADM-018: Filter Inventory by Status', () => {
    cy.visit('http://127.0.0.1:8000/inventory')
    
    // Filter by Available status
    cy.get('select[name="status"]').select('available')
    cy.get('button').contains('Filter').click()
    
    // Verify filtered results
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('.badge').should('contain', 'Available')
    })
  })

  it('UAT-ADM-019: Search Inventory by Name', () => {
    cy.visit('http://127.0.0.1:8000/inventory')
    
    // Search for equipment
    cy.get('input[name="search"]').type('Helm')
    cy.get('button').contains('Filter').click()
    
    // Verify search results
    cy.get('tbody tr').should('contain', 'Helm')
  })

  it('UAT-ADM-020: Delete Equipment Unit', () => {
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
})
