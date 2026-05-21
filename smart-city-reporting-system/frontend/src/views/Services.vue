<template>
  <div class="services-page">
    <!-- Hero Section -->
    <section class="services-hero">
      <div class="hero-bg"></div>
      <div class="services-hero-content">
        <h1 data-aos="fade-up">
          <i class="fas fa-concierge-bell"></i> Our Services
        </h1>
        <p data-aos="fade-up" data-aos-delay="100">
          Comprehensive digital services for a smarter Kigali
        </p>
      </div>
    </section>

    <!-- Smart City Pillars -->
    <section class="pillars">
      <div class="container">
        <h2 data-aos="fade-up">
          <i class="fas fa-city"></i> Smart City Pillars
        </h2>
        <div class="pillars-grid">
          <div class="pillar-card" data-aos="flip-left">
            <i class="fas fa-car"></i>
            <h3>Smart Mobility</h3>
            <p>Intelligent transport systems, traffic management, and sustainable mobility solutions</p>
          </div>
          <div class="pillar-card" data-aos="flip-left" data-aos-delay="100">
            <i class="fas fa-laptop"></i>
            <h3>E-Government</h3>
            <p>Digital public services, online permits, and citizen portals</p>
          </div>
          <div class="pillar-card" data-aos="flip-left" data-aos-delay="200">
            <i class="fas fa-chart-line"></i>
            <h3>Smart Economy</h3>
            <p>Digital business hubs, innovation centers, and economic growth</p>
          </div>
          <div class="pillar-card" data-aos="flip-left" data-aos-delay="300">
            <i class="fas fa-leaf"></i>
            <h3>Smart Environment</h3>
            <p>Waste management, green energy, and environmental monitoring</p>
          </div>
          <div class="pillar-card" data-aos="flip-left" data-aos-delay="400">
            <i class="fas fa-shield-alt"></i>
            <h3>Safe City</h3>
            <p>Surveillance, emergency response, and public safety systems</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Digital Services Grid -->
    <section class="digital-services">
      <div class="container">
        <h2 data-aos="fade-up">
          <i class="fas fa-digital-tiling"></i> Digital Services
        </h2>
        <div class="services-grid">
          <div class="service-card" data-aos="zoom-in">
            <div class="service-icon">
              <i class="fas fa-flag-checkered"></i>
            </div>
            <h3>Report an Issue</h3>
            <p>Report civic issues like potholes, drainage problems, or broken streetlights</p>
            <router-link to="/report" class="service-link">
              Start Reporting <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>

          <div class="service-card" data-aos="zoom-in" data-aos-delay="100">
            <div class="service-icon">
              <i class="fas fa-file-alt"></i>
            </div>
            <h3>Apply for Permits</h3>
            <p>Construction permits, business licenses, and event approvals online</p>
            <a href="#" class="service-link">
              Apply Now <i class="fas fa-arrow-right"></i>
            </a>
          </div>

          <div class="service-card" data-aos="zoom-in" data-aos-delay="200">
            <div class="service-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
            <h3>Open Data Portal</h3>
            <p>Access city data, statistics, and analytics for research and innovation</p>
            <a href="#" class="service-link">
              Explore Data <i class="fas fa-arrow-right"></i>
            </a>
          </div>

          <div class="service-card" data-aos="zoom-in" data-aos-delay="300">
            <div class="service-icon">
              <i class="fas fa-credit-card"></i>
            </div>
            <h3>Pay City Taxes</h3>
            <p>Property taxes, utility bills, and municipal fees online payment</p>
            <a href="#" class="service-link">
              Pay Now <i class="fas fa-arrow-right"></i>
            </a>
          </div>

          <div class="service-card" data-aos="zoom-in" data-aos-delay="400">
            <div class="service-icon">
              <i class="fas fa-bus"></i>
            </div>
            <h3>Public Transport</h3>
            <p>Real-time bus tracking, route planning, and digital ticketing</p>
            <a href="#" class="service-link">
              Plan Journey <i class="fas fa-arrow-right"></i>
            </a>
          </div>

          <div class="service-card" data-aos="zoom-in" data-aos-delay="500">
            <div class="service-icon">
              <i class="fas fa-hand-holding-heart"></i>
            </div>
            <h3>Community Services</h3>
            <p>Volunteer opportunities, community events, and public consultations</p>
            <a href="#" class="service-link">
              Join Now <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Request Form -->
    <section class="service-request">
      <div class="container">
        <div class="request-content" data-aos="fade-right">
          <h2><i class="fas fa-headset"></i> Need Assistance?</h2>
          <p>Our team is here to help you with any city service</p>
          <form @submit.prevent="submitRequest" class="request-form">
            <div class="form-group">
              <i class="fas fa-user"></i>
              <input type="text" v-model="request.name" placeholder="Your Name" required>
            </div>
            <div class="form-group">
              <i class="fas fa-envelope"></i>
              <input type="email" v-model="request.email" placeholder="Your Email" required>
            </div>
            <div class="form-group">
              <i class="fas fa-tag"></i>
              <select v-model="request.service">
                <option value="">Select Service</option>
                <option value="report">Report Issue</option>
                <option value="permit">Permit Application</option>
                <option value="data">Data Request</option>
                <option value="payment">Payment Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <i class="fas fa-comment"></i>
              <textarea v-model="request.message" rows="3" placeholder="Your Message"></textarea>
            </div>
            <button type="submit" class="submit-btn">
              <i class="fas fa-paper-plane"></i> Submit Request
            </button>
          </form>
        </div>
        <div class="request-image" data-aos="fade-left">
          <div class="image-placeholder">
            <i class="fas fa-headset"></i>
            <p>24/7 Support Available</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AOS from 'aos'
import 'aos/dist/aos.css'

export default {
  name: 'Services',
  data() {
    return {
      request: {
        name: '',
        email: '',
        service: '',
        message: ''
      }
    }
  },
  mounted() {
    AOS.init({ duration: 1000, once: true })
  },
  methods: {
    submitRequest() {
      alert('Thank you! Your request has been submitted. We will contact you soon.')
      this.request = { name: '', email: '', service: '', message: '' }
    }
  }
}
</script>

<style scoped>
.services-page {
  font-family: 'Inter', sans-serif;
}

.services-hero {
  position: relative;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
  background-size: cover;
}

.services-hero-content {
  position: relative;
  z-index: 1;
}

.services-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.pillars, .digital-services {
  padding: 4rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #1e293b;
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
}

.pillar-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.pillar-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.pillar-card i {
  font-size: 2.5rem;
  color: #0ea5e9;
  margin-bottom: 1rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.service-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  transition: all 0.3s;
  border: 1px solid #e2e8f0;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  border-color: #0ea5e9;
}

.service-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.service-icon i {
  font-size: 1.5rem;
  color: white;
}

.service-card h3 {
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.service-card p {
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.service-link {
  color: #0ea5e9;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.service-request {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 4rem 2rem;
}

.service-request .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.request-form {
  margin-top: 2rem;
}

.form-group {
  position: relative;
  margin-bottom: 1rem;
}

.form-group i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
}

.form-group textarea {
  padding-top: 0.75rem;
}

.form-group textarea + i {
  top: 1rem;
  transform: none;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.image-placeholder {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  border-radius: 16px;
  padding: 4rem;
  text-align: center;
  color: white;
}

.image-placeholder i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .service-request .container {
    grid-template-columns: 1fr;
  }
  
  .services-hero h1 {
    font-size: 2rem;
  }
}
</style>