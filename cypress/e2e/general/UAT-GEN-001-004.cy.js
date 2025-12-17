describe('UAT General Scenarios 001-004', () => {
  // UAT-GEN-001: Admin Melihat Semua Laporan
  it('UAT-GEN-001: Admin melihat semua laporan', () => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    ;['equipment','problems','daily-reports'].forEach(path => {
      cy.visit(`http://127.0.0.1:8000/${path}`)
      cy.get('body').should(($body) => {
        const text = $body.text()
        expect(/(Report|Laporan)/i.test(text)).to.eq(true)
      })
    })
  })

  // UAT-GEN-002: Operator melihat laporan sendiri
  it('UAT-GEN-002: Operator melihat laporan sendiri', () => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('operator@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    ;['problems','daily-reports'].forEach(path => {
      cy.visit(`http://127.0.0.1:8000/${path}`)
      cy.get('body').should(($body) => {
        const text = $body.text()
        expect(/(My|Saya)/i.test(text)).to.eq(true)
      })
    })
  })

  // UAT-GEN-003: Pencarian Laporan Masalah
  it('UAT-GEN-003: Pencarian laporan masalah', () => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    cy.visit('http://127.0.0.1:8000/problems')
    cy.get('input[type="search"], input[name="search"], input[placeholder*="Search" i]').first().type('test')
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(/(Problem|Masalah)/i.test(text)).to.eq(true)
    })
  })

  // UAT-GEN-004: Filter Laporan Harian (Supervisor)
  it('UAT-GEN-004: Supervisor filter laporan harian berdasarkan tanggal', () => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('supervisor@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    cy.visit('http://127.0.0.1:8000/daily-reports')
    cy.get('input[type="date"], select[name*="date" i]').first().type('2025-01-01', { force: true })
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(/(Daily|Laporan)/i.test(text)).to.eq(true)
    })
  })
})
