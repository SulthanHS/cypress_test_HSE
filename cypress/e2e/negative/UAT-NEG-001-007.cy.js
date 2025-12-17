describe('UAT Negative Scenarios 001-007', () => {
  // UAT-NEG-001: Akses Tanpa Izin
  it('UAT-NEG-001: Operator akses User Management ditolak', () => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('operator@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    cy.visit('http://127.0.0.1:8000/users', { failOnStatusCode: false })
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(/(Unauthorized|Forbidden)/i.test(text)).to.eq(true)
    })
  })

  // UAT-NEG-002: Formulir Kosong
  it('UAT-NEG-002: Submit form New Request tanpa data', () => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('safety@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    cy.visit('http://127.0.0.1:8000/equipment/create')
    cy.contains(/Submit|Kirim|Create/i).click({ force: true })
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(/(required|wajib)/i.test(text)).to.eq(true)
    })
  })

  // UAT-NEG-003: Input Tipe Data Salah
  it('UAT-NEG-003: Quantity diisi teks', () => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('safety@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    cy.visit('http://127.0.0.1:8000/equipment/create')
    cy.get('input[name="quantity"]').type('abc')
    cy.contains(/Submit|Kirim|Create/i).click({ force: true })
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(/(number|angka)/i.test(text)).to.eq(true)
    })
  })

  // UAT-NEG-004: Login Gagal - Kombinasi tidak ditemukan
  it('UAT-NEG-004: Email valid + password milik akun lain', () => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('operator@example.com')
    cy.get('#password').type('wrongpassword')
    cy.get('form').submit()
    cy.get('body').should('contain', 'Email atau password salah')
  })

  // UAT-NEG-005: Email tidak sesuai format
  it('UAT-NEG-005: Email invalid pada Add New User', () => {
    cy.visit('http://127.0.0.1:8000/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password')
    cy.get('form').submit()
    cy.visit('http://127.0.0.1:8000/users/create')
    cy.get('input[name="email"]').type('invalid-email')
    cy.get('button').contains(/Create User/i).click()
    cy.get('body').should('contain', 'email')
  })

  // UAT-NEG-006: Password terlalu pendek
  it('UAT-NEG-006: Password < 8 char pada Add New User', () => {
    cy.visit('http://127.0.0.1:8000/users/create')
    cy.get('input[name="name"]').type('Short Pass User')
    cy.get('input[name="email"]').type(`short${Date.now()}@example.com`)
    cy.get('input[name="password"]').type('short')
    cy.get('input[name="password_confirmation"]').type('short')
    cy.get('select[name="role"]').select('4')
    cy.get('button').contains(/Create User/i).click()
    cy.get('body').should('contain', 'password')
  })

  // UAT-NEG-007: Confirm Password tidak cocok
  it('UAT-NEG-007: Konfirmasi password tidak cocok', () => {
    cy.visit('http://127.0.0.1:8000/users/create')
    cy.get('input[name="name"]').type('Mismatch User')
    cy.get('input[name="email"]').type(`mismatch${Date.now()}@example.com`)
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="password_confirmation"]').type('password456')
    cy.get('select[name="role"]').select('4')
    cy.get('button').contains(/Create User/i).click()
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(/(match|cocok)/i.test(text)).to.eq(true)
    })
  })
})
