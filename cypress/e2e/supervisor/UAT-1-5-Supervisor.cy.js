describe('UAT 1-5 Supervisor Tests', () => {
  
  describe('UAT-SUP-001: Login Berhasil', () => {
    it('should successfully login with valid supervisor credentials', () => {
      // 1. Buka halaman login aplikasi
      cy.visit('http://127.0.0.1:8000/login')
      cy.url().should('include', '/login')
      cy.get('body').should('contain', 'Login')
      
      // 2. Masukkan email dan password supervisor yang valid
      cy.get('#email').type('Agusnoti19@gmail.com')
      cy.get('#password').type('agustian123')
      
      // 3. Klik tombol Login
      cy.get('form').submit()
      
      // Verifikasi login berhasil dan redirect ke supervisor dashboard
      cy.url().should('include', '/supervisor')
      cy.get('body').should('contain', 'Supervisor')
    })
  })

  describe('UAT-SUP-002: Login Gagal - Password Salah', () => {
    it('should show error message when password is incorrect', () => {
      // 1. Buka halaman login
      cy.visit('http://127.0.0.1:8000/login')
      cy.url().should('include', '/login')
      
      // 2. Masukkan email supervisor yang valid
      cy.get('#email').type('Agusnoti19@gmail.com')
      
      // 3. Masukkan password yang salah
      cy.get('#password').type('wrongpassword')
      
      // 4. Klik tombol Login
      cy.get('form').submit()
      
      // Verifikasi error message ditampilkan
      cy.get('.alert-danger').should('be.visible')
      cy.get('.alert-danger').should('contain', 'Email atau password salah')
      
      // Verifikasi tetap di halaman login
      cy.url().should('include', '/login')
    })
  })

  describe('UAT-SUP-003: Login Gagal - Email Tidak Ditemukan', () => {
    it('should show error message when email is not found', () => {
      // 1. Buka halaman login
      cy.visit('http://127.0.0.1:8000/login')
      cy.url().should('include', '/login')
      
      // 2. Masukkan email yang tidak terdaftar
      cy.get('#email').type('nonexistent@example.com')
      
      // 3. Masukkan password
      cy.get('#password').type('anypassword')
      
      // 4. Klik tombol Login
      cy.get('form').submit()
      
      // Verifikasi error message ditampilkan
      cy.get('.alert-danger').should('be.visible')
      cy.get('.alert-danger').should('contain', 'Email atau password salah')
      
      // Verifikasi tetap di halaman login
      cy.url().should('include', '/login')
    })
  })

  describe('UAT-SUP-004: Verifikasi Tampilan Dashboard Supervisor', () => {
    beforeEach(() => {
      // Login sebagai supervisor terlebih dahulu
      cy.visit('http://127.0.0.1:8000/login')
      cy.get('#email').type('Agusnoti19@gmail.com')
      cy.get('#password').type('agustian123')
      cy.get('form').submit()
      cy.url().should('include', '/supervisor')
    })

    it('should display supervisor dashboard with relevant information', () => {
      // 1. Setelah berhasil login, periksa tampilan dashboard supervisor
      cy.url().should('include', '/supervisor')
      cy.get('body').should('contain', 'Supervisor')
      
      // 2. Verifikasi fitur-fitur supervisor tersedia
      cy.get('body').should('satisfy', ($body) => {
        return $body.text().includes('Dashboard') || 
               $body.text().includes('Supervisor') ||
               $body.text().includes('Equipment') ||
               $body.text().includes('Problem')
      })
    })
  })

  describe('UAT-SUP-005: Approve Equipment Purchase Request', () => {
    beforeEach(() => {
      // Login sebagai supervisor terlebih dahulu
      cy.visit('http://127.0.0.1:8000/login')
      cy.get('#email').type('Agusnoti19@gmail.com')
      cy.get('#password').type('agustian123')
      cy.get('form').submit()
      cy.url().should('include', '/supervisor')
    })

    it('should approve an equipment purchase request', () => {
      // 1. Akses halaman equipment purchase requests
      cy.visit('http://127.0.0.1:8000/equipment')
      
      // 2. Cari equipment purchase request yang pending
      cy.get('body').should('contain', 'Equipment')
      
      // 3. Klik tombol approve untuk request pertama
      cy.get('button').contains('Approve').first().click()
      
      // 4. Verifikasi approval berhasil
      cy.get('body').should('contain', 'approved')
    })
  })
})
