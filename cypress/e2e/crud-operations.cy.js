describe('CRUD Operations Tests', () => {
  beforeEach(() => {
    // Login as admin before each test
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    
    // Verify we're on admin dashboard
    cy.url().should('include', '/admin')
  })

  describe('User Management CRUD', () => {
    it('should create a new user', () => {
      cy.visit('http://127.0.0.1:8000/users/create')
      
      // Fill in user form with unique email
      const timestamp = Date.now()
      const uniqueEmail = `testuser${timestamp}@example.com`
      
      cy.get('input[name="name"]').type('Test User')
      cy.get('input[name="email"]').type(uniqueEmail)
      cy.get('input[name="password"]').type('password123')
      cy.get('input[name="password_confirmation"]').type('password123')
      cy.get('select[name="role"]').select('4') // operator role
      
      // Submit form using specific button text
      cy.get('button').contains('Create User').click()
      
      // Verify user was created - check for success message or redirect
      cy.url().should('include', '/users')
      
      // Check for success message or the user in the list
      cy.get('body').should('satisfy', ($body) => {
        return $body.text().includes('successfully') || $body.text().includes('Test User')
      })
    })

    it('should edit an existing user', () => {
      cy.visit('http://127.0.0.1:8000/users')
      
      // Click on edit button for first user (adjust selector as needed)
      cy.get('a[href*="/edit"]').first().click()
      
      // Update user information
      cy.get('input[name="name"]').clear().type('Updated User Name')
      
      // Submit form using specific button text
      cy.get('button').contains('Update User').click()
      
      // Verify user was updated
      cy.url().should('include', '/users')
      cy.get('body').should('contain', 'Updated User Name')
    })
  })

  describe('Equipment Purchase CRUD', () => {
    it('should not create equipment purchase request (admin not allowed)', () => {
      // Admin cannot create equipment purchase - should get 403
      cy.visit('http://127.0.0.1:8000/equipment/create', { failOnStatusCode: false })
      
      // Should get access denied or redirect
      cy.get('body').should('contain', 'Unauthorized')
    })
  })

  describe('Problem Report CRUD', () => {
    it('should not create a problem report (admin not allowed)', () => {
      // Admin cannot create problem reports - should get 403
      cy.visit('http://127.0.0.1:8000/problems/create', { failOnStatusCode: false })
      
      // Should get access denied or redirect
      cy.get('body').should('contain', 'Unauthorized')
    })
  })

  describe('Operator Report CRUD', () => {
    it('should not create an operator report (admin not allowed)', () => {
      // Admin cannot create operator reports - should get 403
      cy.visit('http://127.0.0.1:8000/reports/create', { failOnStatusCode: false })
      
      // Should get access denied
      cy.get('body').should('contain', 'Unauthorized')
    })
  })
})
