describe('UAT 1-5 Safety Officer Tests', () => {
  
  describe('UAT-SOF-001: Login Berhasil', () => {
    it('should successfully login with valid safety officer credentials', () => {
      // 1. Buka halaman login aplikasi
      cy.visit('http://127.0.0.1:8000/login')
      cy.url().should('include', '/login')
      cy.get('body').should('contain', 'Login')
      
      // 2. Masukkan email dan password safety officer yang valid
      cy.get('#email').type('rendiando12@gmail.com')
      cy.get('#password').type('rendi123')
      
      // 3. Klik tombol Login
      cy.get('form').submit()
      
      // Verifikasi login berhasil dan redirect ke safety officer dashboard
      cy.url().should('include', '/safety-officer')
      cy.get('body').should('contain', 'Safety Officer')
    })
  })

  describe('UAT-SOF-002: Login Gagal - Password Salah', () => {
    it('should show error message when password is incorrect', () => {
      // 1. Buka halaman login
      cy.visit('http://127.0.0.1:8000/login')
      cy.url().should('include', '/login')
      
      // 2. Masukkan email safety officer yang valid
      cy.get('#email').type('rendiando12@gmail.com')
      
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

  describe('UAT-SOF-003: Login Gagal - Email Tidak Ditemukan', () => {
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

  describe('UAT-SOF-004: Verifikasi Tampilan Dashboard Safety Officer', () => {
    beforeEach(() => {
      // Login sebagai safety officer terlebih dahulu
      cy.visit('http://127.0.0.1:8000/login')
      cy.get('#email').type('rendiando12@gmail.com')
      cy.get('#password').type('rendi123')
      cy.get('form').submit()
      cy.url().should('include', '/safety-officer')
    })

    it('should display safety officer dashboard with relevant information', () => {
      // 1. Setelah berhasil login, periksa tampilan dashboard safety officer
      cy.url().should('include', '/safety-officer')
      cy.get('body').should('contain', 'Safety Officer')
      
      // 2. Verifikasi fitur-fitur safety officer tersedia
      cy.get('body').should('satisfy', ($body) => {
        return $body.text().includes('Dashboard') || 
               $body.text().includes('Safety Officer') ||
               $body.text().includes('Equipment') ||
               $body.text().includes('Inventory')
      })
    })
  })

  describe('UAT-SOF-005: Membuat Equipment Purchase Request', () => {
    beforeEach(() => {
      // Login sebagai safety officer terlebih dahulu
      cy.visit('http://127.0.0.1:8000/login')
      cy.get('#email').type('rendiando12@gmail.com')
      cy.get('#password').type('rendi123')
      cy.get('form').submit()
      cy.url().should('include', '/safety-officer')
    })

    it('should create a new equipment purchase request', () => {
      // 1. Akses halaman create equipment purchase
      cy.visit('http://127.0.0.1:8000/equipment/create')
      
      // 2. Isi form equipment purchase
      cy.get('input[name="name"]').type('Test Equipment')
      cy.get('input[name="quantity"]').type('5')
      cy.get('textarea[name="description"]').type('Test equipment description')
      cy.get('select[name="category"]').select('Helm')
      cy.get('input[name="unit_price"]').type('1000')
      cy.get('input[name="purchase_location"]').type('Test Location')
      cy.get('input[name="storage_location"]').type('Test Warehouse')
      
      // 3. Submit form
      cy.get('button[type="submit"]').click()
      
      // 4. Verifikasi equipment purchase request berhasil dibuat
      cy.url().should('include', '/equipment')
      cy.get('body').should('contain', 'Test Equipment')
    })
  })
})
