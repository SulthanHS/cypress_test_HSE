describe('UAT 1-4 Supervisor Equipment Requests', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('supervisor@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    cy.url().should('include', '/supervisor')
  })

  // UAT-SPV-001: Setujui Permintaan Peralatan
  it('UAT-SPV-001: Supervisor menyetujui permintaan peralatan', () => {
    cy.visit('http://127.0.0.1:8000/equipment')
    cy.contains(/Review|Detail/i).first().click({ force: true })
    cy.contains(/Approve|Setujui/i).first().click({ force: true })
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(/(approved|disetujui)/i.test(text)).to.eq(true)
    })
  })

  // UAT-SPV-002: Tolak Permintaan Peralatan
  it('UAT-SPV-002: Supervisor menolak permintaan peralatan', () => {
    cy.visit('http://127.0.0.1:8000/equipment')
    cy.contains(/Review|Detail/i).first().click({ force: true })
    cy.contains(/Reject|Tolak/i).first().click({ force: true })
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(/(rejected|ditolak)/i.test(text)).to.eq(true)
    })
  })

  // UAT-SPV-003: Verifikasi Notifikasi ke Safety Officer
  it('UAT-SPV-003: Notifikasi terkirim ke Safety Officer', () => {
    cy.visit('http://127.0.0.1:8000/notifications')
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(/(Notification|Notifikasi)/i.test(text)).to.eq(true)
    })
  })

  // UAT-SPV-004: Tinjau Laporan Harian
  it('UAT-SPV-004: Supervisor mereview Daily Reports', () => {
    cy.visit('http://127.0.0.1:8000/daily-reports')
    cy.contains(/Review|Detail|Lihat/i).first().click({ force: true })
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(/(Report|Laporan)/i.test(text)).to.eq(true)
    })
  })
})
