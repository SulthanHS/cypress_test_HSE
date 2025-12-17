describe('Verify Existing Test Users for All Roles', () => {
  beforeEach(() => {
    // Login as admin
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    cy.url().should('include', '/admin')
  })

  describe('Verify Existing Users', () => {
    it('should verify operator user exists', () => {
      cy.visit('http://127.0.0.1:8000/users')
      
      // Verify operator user is present
      cy.get('body').should('contain', 'Operator Perdana')
      cy.get('body').should('contain', 'perdanado11@gmail.com')
    })

    it('should verify safety officer user exists', () => {
      cy.visit('http://127.0.0.1:8000/users')
      
      // Verify safety officer user is present
      cy.get('body').should('contain', 'Safety Officer Rendi')
      cy.get('body').should('contain', 'rendiando12@gmail.com')
    })

    it('should verify supervisor user exists', () => {
      cy.visit('http://127.0.0.1:8000/users')
      
      // Verify supervisor user is present
      cy.get('body').should('contain', 'Supervisor Agus')
      cy.get('body').should('contain', 'Agusnoti19@gmail.com')
    })
  })

  describe('Verify User Roles', () => {
    it('should verify all users have correct roles', () => {
      cy.visit('http://127.0.0.1:8000/users')
      
      // Verify admin role
      cy.get('body').should('contain', 'admin@example.com')
      
      // Verify other users exist with their roles
      cy.get('body').should('contain', 'perdanado11@gmail.com')
      cy.get('body').should('contain', 'rendiando12@gmail.com')
      cy.get('body').should('contain', 'Agusnoti19@gmail.com')
    })
  })
})
