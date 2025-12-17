describe('Role-Based Access Control Tests', () => {
  
  describe('Admin Role Access', () => {
    beforeEach(() => {
      // Login as admin
      cy.visit('http://127.0.0.1:8000/login')
      cy.get('#email').type('admin@example.com')
      cy.get('#password').type('password')
      cy.get('form').submit()
      cy.url().should('include', '/admin')
    })

    it('should access admin dashboard', () => {
      cy.url().should('include', '/admin')
      cy.get('body').should('contain', 'Admin')
    })

    it('should access user management (admin only)', () => {
      cy.visit('http://127.0.0.1:8000/users')
      cy.url().should('include', '/users')
      cy.get('body').should('contain', 'User Management')
    })

    it('should access all equipment features', () => {
      cy.visit('http://127.0.0.1:8000/equipment')
      cy.url().should('include', '/equipment')
    })

    it('should access inventory management', () => {
      cy.visit('http://127.0.0.1:8000/inventory')
      cy.url().should('include', '/inventory')
    })

    it('should access all problem reports', () => {
      cy.visit('http://127.0.0.1:8000/problems')
      cy.url().should('include', '/problems')
    })

    it('should not access operator reports (admin not allowed)', () => {
      cy.visit('http://127.0.0.1:8000/reports', { failOnStatusCode: false })
      cy.get('body').should('contain', 'Unauthorized access')
    })
  })

  describe('Unauthorized Access Tests', () => {
    it('should redirect to login when accessing protected routes without authentication', () => {
      // Test that unauthenticated users are redirected to login
      const protectedRoutes = [
        '/admin',
        '/supervisor', 
        '/safety-officer',
        '/operator',
        '/users',
        '/equipment',
        '/inventory',
        '/problems',
        '/reports'
      ]

      protectedRoutes.forEach(route => {
        cy.visit(`http://127.0.0.1:8000${route}`)
        cy.url().should('include', '/login')
      })
    })

    it('should test role middleware protection', () => {
      // Login as admin first
      cy.visit('http://127.0.0.1:8000/login')
      cy.get('#email').type('admin@example.com')
      cy.get('#password').type('password')
      cy.get('form').submit()
      
      // Test that admin can access admin-only routes
      cy.visit('http://127.0.0.1:8000/users')
      cy.url().should('include', '/users')
    })
  })

  describe('Role-Specific Feature Access', () => {
    it('should test admin cannot access operator reports', () => {
      // Login as admin
      cy.visit('http://127.0.0.1:8000/login')
      cy.get('#email').type('admin@example.com')
      cy.get('#password').type('password')
      cy.get('form').submit()
      
      // Try to access operator reports - should be denied
      cy.visit('http://127.0.0.1:8000/reports', { failOnStatusCode: false })
      cy.get('body').should('contain', 'Unauthorized access')
    })

    it('should test admin cannot create equipment purchase', () => {
      // Login as admin
      cy.visit('http://127.0.0.1:8000/login')
      cy.get('#email').type('admin@example.com')
      cy.get('#password').type('password')
      cy.get('form').submit()
      
      // Try to access equipment create - should be denied
      cy.visit('http://127.0.0.1:8000/equipment/create', { failOnStatusCode: false })
      cy.get('body').should('contain', 'Unauthorized')
    })
  })
})
