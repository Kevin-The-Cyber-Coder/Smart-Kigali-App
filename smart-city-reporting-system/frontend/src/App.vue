<template>
  <div id="app">
    <!-- Navigation Bar -->
    <nav class="navbar" :class="{ 'scrolled': isScrolled }">
      <div class="nav-container">
        <div class="logo" @click="$router.push('/')">
          <span>Smart <span class="highlight">Kigali</span></span>
          <span class="rwanda-badge">Rwanda</span>
        </div>
        
        <div class="nav-menu" :class="{ 'active': mobileMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMobileMenu">Home</router-link>
          
          <router-link to="/about" class="nav-link" @click="closeMobileMenu">About Smart Kigali</router-link>
          
          <!-- Services Dropdown -->
          <div class="dropdown" @mouseenter="openDropdown" @mouseleave="closeDropdown">
            <a href="#" class="nav-link dropdown-toggle" @click.prevent="toggleDropdown">
              Services 
              <span class="chevron" :class="{ 'rotated': dropdownOpen }">▼</span>
            </a>
            <div class="dropdown-menu" :class="{ 'show': dropdownOpen }">
              <router-link to="/services#advisory" class="dropdown-item" @click="closeMobileMenu">Smart City Advisory Services</router-link>
              <router-link to="/services#implementation" class="dropdown-item" @click="closeMobileMenu">Smart City Solution Implementation</router-link>
              <router-link to="/services#capacity" class="dropdown-item" @click="closeMobileMenu">Smart City Capacity Development</router-link>
              <router-link to="/services#connect" class="dropdown-item" @click="closeMobileMenu">Smart City Connect</router-link>
            </div>
          </div>
          
          <router-link to="/news" class="nav-link" @click="closeMobileMenu">News</router-link>
          
          <router-link to="/contact" class="nav-link" @click="closeMobileMenu">Contact Us</router-link>
          
          <div class="nav-buttons">
            <router-link v-if="!isLoggedIn" to="/login" class="nav-link btn-login" @click="closeMobileMenu">Login</router-link>
            <router-link v-if="!isLoggedIn" to="/register" class="nav-link btn-register" @click="closeMobileMenu">Get Started</router-link>
            <button v-if="isLoggedIn" @click="logout" class="nav-link btn-logout">Logout</button>
          </div>
        </div>
        
        <div class="mobile-menu-btn" @click="toggleMobileMenu">
          <span class="hamburger" :class="{ 'active': mobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <router-view />

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-top">
        <div class="footer-container">
          <div class="footer-column">
            <div class="footer-logo">
              <div>
                <h3>Smart <span>Kigali</span> Rwanda</h3>
                <p>Accelerating sustainable and inclusive socio-economic transformation through technology and innovation.</p>
              </div>
            </div>
            <div class="social-links">
              <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
              <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
              <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
              <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
          
          <div class="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><router-link to="/about">About</router-link></li>
              <li><router-link to="/services">Our Interventions</router-link></li>
              <li><router-link to="/impact">Impact Achieved</router-link></li>
              <li><router-link to="/partners">Partners</router-link></li>
            </ul>
          </div>
          
          <div class="footer-column">
            <h4>Connect</h4>
            <ul>
              <li>info@smartkigali.rw</li>
              <li>(+250) 0737 692 152</li>
              <li>7th floor, City Center,<br>KG 542 St, Kigali</li>
            </ul>
          </div>
          
          <div class="footer-column">
            <h4>Newsletter</h4>
            <p>Subscribe to get updates on smart city innovations</p>
            <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
              <div class="input-group">
                <input type="email" v-model="newsletterEmail" placeholder="Your email address" required>
                <button type="submit">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-container">
          <p>&copy; 2026 Smart Kigali Rwanda. All rights reserved.</p>
          <div class="footer-links">
            <router-link to="/privacy">Privacy Policy</router-link>
            <router-link to="/terms">Terms of Service</router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isScrolled: false,
      mobileMenuOpen: false,
      dropdownOpen: false,
      newsletterEmail: ''
    }
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token')
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
      if (this.mobileMenuOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false
      document.body.style.overflow = ''
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    openDropdown() {
      if (window.innerWidth > 968) {
        this.dropdownOpen = true
      }
    },
    closeDropdown() {
      if (window.innerWidth > 968) {
        this.dropdownOpen = false
      }
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
    subscribeNewsletter() {
      alert(`Thank you for subscribing with ${this.newsletterEmail}! You'll receive our latest updates.`)
      this.newsletterEmail = ''
    }
  }
}
</script>

<style>
:root {
  --primary: #0057B8;
  --secondary: #16A34A;
  --accent: #F4B400;
  --bg: #F8FAFC;
  --text: #0F172A;
  --text-light: #64748B;
  --white: #FFFFFF;
  --danger: #EF4444;
  --success: #10B981;
  --warning: #F59E0B;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ============================================
   NAVIGATION BAR STYLES
   ============================================ */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--white);
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.navbar.scrolled {
  background: var(--white);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo Styles */
.logo {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: 700;
}

.logo span:first-child {
  color: var(--text);
}

.logo .highlight {
  color: var(--primary);
}

.rwanda-badge {
  font-size: 0.7rem;
  background: #f1f5f9;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: var(--text-light);
  font-weight: 500;
}

/* Navigation Menu */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  transition: all 0.3s;
  font-size: 0.9rem;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link:hover {
  color: var(--primary);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width 0.3s;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-link.router-link-active {
  color: var(--primary);
}

/* Dropdown Styles */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.chevron {
  font-size: 0.7rem;
  transition: transform 0.3s;
  display: inline-block;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--white);
  min-width: 260px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s;
  z-index: 100;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1.25rem;
  text-decoration: none;
  color: var(--text);
  transition: all 0.3s;
  font-size: 0.875rem;
}

.dropdown-item:hover {
  background: var(--bg);
  color: var(--primary);
}

.dropdown-item:first-child {
  border-radius: 12px 12px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 12px 12px;
}

/* Navigation Buttons */
.nav-buttons {
  display: flex;
  gap: 0.75rem;
  margin-left: 0.5rem;
}

.btn-login {
  color: var(--text);
}

.btn-register {
  background: var(--primary);
  color: var(--white);
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
}

.btn-register:hover {
  background: var(--secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 87, 184, 0.3);
  color: var(--white);
}

.btn-register::after {
  display: none;
}

.btn-logout {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

/* Mobile Menu Button - Hamburger */
.mobile-menu-btn {
  display: none;
  cursor: pointer;
}

.hamburger {
  width: 24px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  width: 100%;
  height: 2px;
  background: var(--text);
  transition: all 0.3s;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* ============================================
   FOOTER STYLES
   ============================================ */
.footer {
  background: var(--text);
  color: #cbd5e1;
  margin-top: auto;
}

.footer-top {
  padding: 4rem 0 2rem;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem;
}

/* Footer Logo */
.footer-logo {
  margin-bottom: 1.5rem;
}

.footer-logo h3 {
  color: var(--white);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.footer-logo h3 span {
  color: var(--primary);
}

.footer-logo p {
  font-size: 0.875rem;
  line-height: 1.5;
  opacity: 0.8;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.social-link {
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  color: #cbd5e1;
  text-decoration: none;
}

.social-link:hover {
  background: var(--primary);
  transform: translateY(-3px);
  color: var(--white);
}

/* Footer Columns */
.footer-column h4 {
  color: var(--white);
  font-size: 1.125rem;
  margin-bottom: 1.25rem;
  position: relative;
  display: inline-block;
}

.footer-column h4::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 2px;
  background: var(--accent);
}

.footer-column ul {
  list-style: none;
}

.footer-column ul li {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  opacity: 0.8;
  transition: all 0.3s;
}

.footer-column ul li a {
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.3s;
}

.footer-column ul li a:hover {
  color: var(--primary);
  padding-left: 5px;
}

/* Newsletter Form */
.newsletter-form {
  margin-top: 1rem;
}

.newsletter-form p {
  font-size: 0.875rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.input-group input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #334155;
  background: #1e293b;
  border-radius: 8px;
  color: var(--white);
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
}

.input-group input:focus {
  outline: none;
  border-color: var(--primary);
}

.input-group input::placeholder {
  color: #64748b;
}

.input-group button {
  background: var(--primary);
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  color: var(--white);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.input-group button:hover {
  background: var(--secondary);
  transform: translateY(-2px);
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid #1e293b;
  padding: 1.5rem 0;
}

.footer-bottom .footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.footer-bottom p {
  font-size: 0.875rem;
  opacity: 0.7;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links a {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--primary);
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 968px) {
  .mobile-menu-btn {
    display: block;
  }
  
  .nav-menu {
    position: fixed;
    top: 70px;
    left: -100%;
    width: 100%;
    height: calc(100vh - 70px);
    background: var(--white);
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    transition: left 0.3s;
    overflow-y: auto;
    gap: 1rem;
  }
  
  .nav-menu.active {
    left: 0;
  }
  
  .nav-link {
    width: 100%;
    padding: 0.75rem 0;
  }
  
  .dropdown {
    width: 100%;
  }
  
  .dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    padding-left: 1.5rem;
    display: none;
  }
  
  .dropdown-menu.show {
    display: block;
  }
  
  .dropdown-toggle {
    justify-content: space-between;
    width: 100%;
  }
  
  .nav-buttons {
    flex-direction: column;
    width: 100%;
    margin-left: 0;
    margin-top: 1rem;
    gap: 0.5rem;
  }
  
  .btn-register {
    text-align: center;
  }
  
  .footer-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-bottom .footer-container {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0.75rem 1rem;
  }
  
  .footer-container {
    padding: 0 1rem;
  }
}
</style>