describe('UAT 1-5 Operator Tests', () => {
  
  describe('UAT-OPR-001: Login Berhasil', () => {
    it('should successfully login with valid operator credentials', () => {
      // 1. Buka halaman login aplikasi
      cy.visit('http://127.0.0.1:8000/login')
      cy.url().should('include', '/login')
      cy.get('body').should('contain', 'Login')
      
      // 2. Masukkan email dan password operator yang valid
      cy.get('#email').type('perdanado11@gmail.com')
      cy.get('#password').type('perdana123')
      
      // 3. Klik tombol Login
      cy.get('form').submit()
      
      // Verifikasi login berhasil dan redirect ke operator dashboard
      cy.url().should('include', '/operator')
      cy.get('body').should('contain', 'Operator')
    })
  })

  describe('UAT-OPR-002: Login Gagal - Password Salah', () => {
    it('should show error message when password is incorrect', () => {
      // 1. Buka halaman login
      cy.visit('http://127.0.0.1:8000/login')
      cy.url().should('include', '/login')
      
      // 2. Masukkan email operator yang valid
      cy.get('#email').type('perdanado11@gmail.com')
      
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

  describe('UAT-OPR-003: Login Gagal - Email Tidak Ditemukan', () => {
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

  describe('UAT-OPR-004: Verifikasi Tampilan Dashboard Operator', () => {
    beforeEach(() => {
      // Login sebagai operator terlebih dahulu
      cy.visit('http://127.0.0.1:8000/login')
      cy.get('#email').type('perdanado11@gmail.com')
      cy.get('#password').type('perdana123')
      cy.get('form').submit()
      cy.url().should('include', '/operator')
    })

    it('should display operator dashboard with relevant information', () => {
      // 1. Setelah berhasil login, periksa tampilan dashboard operator
      cy.url().should('include', '/operator')
      cy.get('body').should('contain', 'Operator')
      
      // 2. Verifikasi fitur-fitur operator tersedia
      cy.get('body').should('satisfy', ($body) => {
        return $body.text().includes('Dashboard') || 
               $body.text().includes('Operator') ||
               $body.text().includes('Report') ||
               $body.text().includes('Problem')
      })
    })
  })

  describe('UAT-OPR-005: Membuat Problem Report', () => {
    beforeEach(() => {
      // Login sebagai operator terlebih dahulu
      cy.visit('http://127.0.0.1:8000/login')
      cy.get('#email').type('perdanado11@gmail.com')
      cy.get('#password').type('perdana123')
      cy.get('form').submit()
      cy.url().should('include', '/operator')
    })

    it('should create a new problem report', () => {
      // 1. Akses halaman create problem report
      cy.visit('http://127.0.0.1:8000/problems/create')
      
      // 2. Isi form problem report
      cy.get('input[id="equipment_unit_search"]').type('Test Equipment')
      cy.get('textarea[name="description"]').type('Test problem description')
      
      // 3. Submit form
      cy.get('button[type="submit"]').click()
      
      // 4. Verifikasi problem report berhasil dibuat
      cy.url().should('include', '/problems')
      cy.get('body').should('contain', 'Test Problem Report')
    })
  })
})
