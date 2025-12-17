// Allure reporting commands
Cypress.Commands.add('allureStep', (stepName, stepFunction) => {
  if (Cypress.env('allure')) {
    cy.allure().step(stepName, stepFunction)
  } else {
    stepFunction()
  }
})

Cypress.Commands.add('allureDescription', (description) => {
  if (Cypress.env('allure')) {
    cy.allure().description(description)
  }
})

Cypress.Commands.add('allureSeverity', (severity) => {
  if (Cypress.env('allure')) {
    cy.allure().severity(severity)
  }
})

Cypress.Commands.add('allureEpic', (epic) => {
  if (Cypress.env('allure')) {
    cy.allure().epic(epic)
  }
})

Cypress.Commands.add('allureFeature', (feature) => {
  if (Cypress.env('allure')) {
    cy.allure().feature(feature)
  }
})

Cypress.Commands.add('allureStory', (story) => {
  if (Cypress.env('allure')) {
    cy.allure().story(story)
  }
})

Cypress.Commands.add('allureTag', (tag) => {
  if (Cypress.env('allure')) {
    cy.allure().tag(tag)
  }
})

// Custom command to login as admin
Cypress.Commands.add('loginAsAdmin', () => {
  cy.visit('http://127.0.0.1:8000/login')
  cy.get('#email').type('admin@example.com')
  cy.get('#password').type('password')
  cy.get('form').submit()
  cy.url().should('include', '/admin')
})

// Custom command to cleanup test users
Cypress.Commands.add('cleanupTestUsers', () => {
  cy.loginAsAdmin()
  cy.visit('http://127.0.0.1:8000/users')
  
  cy.get('tbody tr').then(($rows) => {
    if ($rows.length === 0) {
      cy.log('No users found to cleanup')
      return
    }

    $rows.each((index, row) => {
      const $row = Cypress.$(row)
      const email = $row.find('td:nth-child(3)').text().trim()
      const name = $row.find('td:nth-child(2)').text().trim()
      
      // Check if it's a test user
      if (email.includes('testuser') || name.includes('Test User') || name.includes('Updated User Name')) {
        cy.log(`Cleaning up test user: ${name} (${email})`)
        
        // Click delete button
        cy.wrap($row).find('form[action*="destroy"] button[type="submit"]').click()
        
        // Handle confirmation dialog
        cy.on('window:confirm', () => true)
        
        // Wait for success message
        cy.get('body').should('contain', 'deleted successfully')
        
        // Reload page
        cy.reload()
        cy.wait(1000)
      }
    })
  })
})

// Custom command to verify no test users exist
Cypress.Commands.add('verifyNoTestUsers', () => {
  cy.visit('http://127.0.0.1:8000/users')
  
  cy.get('tbody tr').each(($row) => {
    const email = $row.find('td:nth-child(3)').text()
    const name = $row.find('td:nth-child(2)').text()
    
    // Verify no test users exist
    expect(email).to.not.include('testuser')
    expect(name).to.not.include('Test User')
    expect(name).to.not.include('Updated User Name')
  })
  
  cy.log('✅ No test users found')
})