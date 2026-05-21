<template>
  <div class="contact-page">
    <section class="contact-header">
      <h1><i class="fas fa-envelope"></i> Contact Us</h1>
      <p>We'd love to hear from you. Get in touch with our team.</p>
    </section>

    <section class="contact-content">
      <div class="contact-grid">
        <div class="contact-info">
          <h2><i class="fas fa-address-card"></i> Get in Touch</h2>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <h3>Address</h3>
              <p>Smart City Tower, 123 Civic Center,<br>Downtown District, City - 110001</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-phone"></i>
            <div>
              <h3>Phone</h3>
              <p>+91 123 456 7890<br>+91 987 654 3210</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <div>
              <h3>Email</h3>
              <p>support@smartcity.com<br>admin@smartcity.com</p>
            </div>
          </div>
        </div>

        <div class="contact-form">
          <h2><i class="fas fa-paper-plane"></i> Send us a Message</h2>
          <form @submit.prevent="handleSubmit">
            <div class="input-group">
              <i class="fas fa-user"></i>
              <input type="text" v-model="form.name" placeholder="Your Name" required>
            </div>
            <div class="input-group">
              <i class="fas fa-envelope"></i>
              <input type="email" v-model="form.email" placeholder="Your Email" required>
            </div>
            <div class="input-group">
              <i class="fas fa-tag"></i>
              <input type="text" v-model="form.subject" placeholder="Subject" required>
            </div>
            <div class="input-group">
              <i class="fas fa-comment"></i>
              <textarea v-model="form.message" rows="5" placeholder="Your Message" required></textarea>
            </div>
            <button type="submit" class="btn-submit" :disabled="loading">
              <i v-if="loading" class="fas fa-spinner fa-pulse"></i>
              <i v-else class="fas fa-paper-plane"></i>
              {{ loading ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      form: { name: '', email: '', subject: '', message: '' },
      loading: false
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      setTimeout(() => {
        alert('Message sent successfully! We will get back to you soon.')
        this.form = { name: '', email: '', subject: '', message: '' }
        this.loading = false
      }, 1500)
    }
  }
}
</script>

<style scoped>
.contact-page {
  animation: fadeIn 0.5s ease;
}

.contact-header {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.contact-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.contact-content {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contact-info h2, .contact-form h2 {
  margin-bottom: 2rem;
  color: #1e293b;
}

.info-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-item i {
  font-size: 1.5rem;
  color: #0ea5e9;
  margin-top: 0.25rem;
}

.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-group i {
  position: absolute;
  left: 1rem;
  top: 0.75rem;
  color: #94a3b8;
}

.input-group input,
.input-group textarea {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s;
}

.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>