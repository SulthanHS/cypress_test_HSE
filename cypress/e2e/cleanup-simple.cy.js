describe('Simple Cleanup Test Users', () => {
  it('should cleanup all test users', () => {
    // Use custom command to cleanup test users
    cy.cleanupTestUsers()
  })

  it('should verify cleanup was successful', () => {
    // Use custom command to verify no test users remain
    cy.verifyNoTestUsers()
  })
})
