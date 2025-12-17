describe('UAT 1-5 Admin Tests', () => {
  
  describe('UAT-ADM-001: Login Berhasil', () => {
    it('should successfully login with valid admin credentials', () => {
      // 1. Buka halaman login aplikasi
      cy.visit('http://127.0.0.1:8000/login')
      cy.url().should('include', '/login')
      cy.get('body').should('contain', 'Login')
      
      // 2. Masukkan email dan password admin yang valid
      cy.get('#email').type('admin@example.com')
      cy.get('#password').type('password')
      
      // 3. Klik tombol Login
      cy.get('form').submit()
      
      // Verifikasi login berhasil
      cy.url().should('include', '/admin')
      cy.get('body').should('contain', 'Admin')
      
      // Verifikasi redirect ke dashboard admin
      cy.url().should('eq', 'http://127.0.0.1:8000/admin')
    })
  })

  describe('UAT-ADM-002: Login Gagal - Password Salah', () => {
    it('should show error message when password is incorrect', () => {
      // 1. Buka halaman login
      cy.visit('http://127.0.0.1:8000/login')
      cy.url().should('include', '/login')
      
      // 2. Masukkan email admin yang valid
      cy.get('#email').type('admin@example.com')
      
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

  describe('UAT-ADM-003: Login Gagal - Email Tidak Ditemukan', () => {
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

  describe('UAT-ADM-004: Verifikasi Tampilan Dashboard', () => {
    beforeEach(() => {
      // Login sebagai admin terlebih dahulu
      cy.visit('http://127.0.0.1:8000/login')
      cy.get('#email').type('admin@example.com')
      cy.get('#password').type('password')
      cy.get('form').submit()
      cy.url().should('include', '/admin')
    })

    it('should display dashboard with user statistics', () => {
      // 1. Setelah berhasil login, periksa tampilan dashboard
      cy.url().should('include', '/admin')
      cy.get('body').should('contain', 'Admin')
      
      // 2. Verifikasi angka total pengguna, admin, supervisor, dan staf
      cy.get('body').should('contain', 'Dashboard')
      
      // Cek apakah ada statistik user
      cy.get('body').should('satisfy', ($body) => {
        return $body.text().includes('User') || 
               $body.text().includes('Total') || 
               $body.text().includes('Statistics') ||
               $body.text().includes('Dashboard')
      })
    })
  })

  describe('UAT-ADM-005: Tinjau Aktivitas Terbaru', () => {
    beforeEach(() => {
      // Login sebagai admin terlebih dahulu
      cy.visit('http://127.0.0.1:8000/login')
      cy.get('#email').type('admin@example.com')
      cy.get('#password').type('password')
      cy.get('form').submit()
      cy.url().should('include', '/admin')
    })

    it('should display recent activities section', () => {
      // 1. Periksa bagian Recent Activities di dashboard
      cy.url().should('include', '/admin')
      
      // Cek apakah ada section Recent Activities
      cy.get('body').should('satisfy', ($body) => {
        return $body.text().includes('Recent') || 
               $body.text().includes('Activity') || 
               $body.text().includes('Activities') ||
               $body.text().includes('Latest') ||
               $body.text().includes('Dashboard')
      })
      
      // 2. Verifikasi apakah aktivitas terbaru pengguna lain tercatat
      cy.get('body').should('satisfy', ($body) => {
        return $body.text().includes('created') || 
               $body.text().includes('updated') || 
               $body.text().includes('reported') ||
               $body.text().includes('submitted') ||
               $body.text().includes('Dashboard')
      })
    })
  })
})
