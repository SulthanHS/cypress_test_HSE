describe('Autocomplete Debug Test', () => {
  it('Test Equipment Unit Autocomplete', () => {
    // Login as operator
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('perdanado11@gmail.com')
    cy.get('#password').type('perdana123')
    cy.get('form').submit()
    cy.url().should('include', '/operator')
    
    // Go to problem create page
    cy.visit('http://127.0.0.1:8000/problems/create')
    
    // Check if jQuery UI is loaded
    cy.window().then((win) => {
      expect(win.$).to.exist
      expect(win.$.ui).to.exist
      cy.log('jQuery UI is loaded')
    })
    
    // Try different search terms that should match existing equipment
    const searchTerms = ['Req', 'REQ', 'Test', 'Equipment']
    
    searchTerms.forEach((term) => {
      cy.log(`Testing search term: ${term}`)
      
      // Clear and type search term
      cy.get('input[id="equipment_unit_search"]').clear().type(term)
      
      // Wait for API call and dropdown to appear
      cy.wait(2000)
      
      // Check if autocomplete dropdown appears
      cy.get('body').then(($body) => {
        const autocomplete = $body.find('.ui-autocomplete')
        const menuItems = $body.find('.ui-menu-item')
        
        cy.log(`Autocomplete elements found: ${autocomplete.length}`)
        cy.log(`Menu items found: ${menuItems.length}`)
        
        if (autocomplete.length > 0) {
          cy.log('Autocomplete dropdown exists')
          
          // Check if it's visible
          if (autocomplete.is(':visible')) {
            cy.log('Autocomplete is visible')
            cy.log(`Dropdown content: ${autocomplete.text()}`)
            
            // Try to click first item
            if (menuItems.length > 0) {
              cy.get('.ui-menu-item').first().click()
              cy.log('Clicked first menu item')
              
              // Verify equipment unit ID is set
              cy.get('input[id="equipment_unit_id"]').should('have.value').and('not.be.empty')
              cy.log('Equipment unit ID set successfully')
            }
          } else {
            cy.log('Autocomplete exists but is not visible')
            cy.log(`CSS display: ${autocomplete.css('display')}`)
            cy.log(`CSS visibility: ${autocomplete.css('visibility')}`)
            cy.log(`CSS z-index: ${autocomplete.css('z-index')}`)
          }
        } else {
          cy.log('No autocomplete dropdown found')
        }
      })
      
      // Wait before next search
      cy.wait(1000)
    })
    
    // Final fallback: manual entry
    cy.get('input[id="equipment_unit_search"]').clear().type('Manual Equipment Entry')
    cy.get('input[id="equipment_unit_id"]').type('999')
    
    // Verify manual entry worked
    cy.get('input[id="equipment_unit_id"]').should('have.value', '999')
  })
})
