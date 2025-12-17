describe('UAT 6-9 Safety Officer Tests', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('safety@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    cy.url().should('include', '/safety-officer')
  })

  // UAT-SO-006: Verifikasi Notifikasi Persetujuan
  it('UAT-SO-006: Safety Officer menerima notifikasi setelah disetujui', () => {
    cy.visit('http://127.0.0.1:8000/notifications')
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(/(Notification|Notifikasi)/i.test(text)).to.eq(true)
    })
  })

  // UAT-SO-007: Selesaikan Laporan Masalah
  it('UAT-SO-007: Safety Officer menyelesaikan laporan masalah Open', () => {
    cy.visit('http://127.0.0.1:8000/problems')
    cy.contains(/Resolve|Selesaikan/i).first().click({ force: true })
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(/(Resolved|Selesai)/i.test(text)).to.eq(true)
    })
  })

  // UAT-SO-008: (tersirat di deskripsi admin, lewati jika tidak ada)
  // No explicit SO-008 in UAT list; skipping to SO-009

  // UAT-SO-009: Memilih Kategori Baru pada New Request
  it('UAT-SO-009: Kategori baru tersedia di New Request', () => {
    cy.visit('http://127.0.0.1:8000/equipment/create')
    cy.get('select[name="category"]').should('exist')
    cy.get('select[name="category"]').then(($sel) => {
      const hasOption = Array.from($sel[0].options).some(o => /Sarung Tangan/i.test(o.text))
      expect(hasOption).to.eq(true)
    })
  })
})
