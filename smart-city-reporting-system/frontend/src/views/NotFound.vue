<template>
  <div class="not-found">
    <div class="error-container" data-aos="fade-up">
      <div class="error-code">
        <i class="fas fa-exclamation-triangle"></i>
        <span>404</span>
      </div>
      <h1>Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
      <div class="actions">
        <router-link to="/" class="btn-home">
          <i class="fas fa-home"></i> Go to Homepage
        </router-link>
        <router-link to="/dashboard" class="btn-dashboard">
          <i class="fas fa-tachometer-alt"></i> Go to Dashboard
        </router-link>
      </div>
      <div class="suggestions">
        <p>You might want to check:</p>
        <ul>
          <li><router-link to="/reports">Browse Reports</router-link></li>
          <li><router-link to="/about">About Smart City</router-link></li>
          <li><router-link to="/contact">Contact Support</router-link></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import AOS from 'aos'

export default {
  name: 'NotFound',
  mounted() {
    AOS.init({ duration: 1000 })
  }
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.error-container {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.error-code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.error-code i {
  font-size: 3rem;
  color: #f59e0b;
}

.error-code span {
  font-size: 4rem;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Inter', sans-serif;
}

.error-container h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.error-container p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn-home, .btn-dashboard {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-home {
  background: #667eea;
  color: white;
}

.btn-dashboard {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-home:hover, .btn-dashboard:hover {
  transform: translateY(-2px);
}

.suggestions {
  text-align: left;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.suggestions ul {
  margin-top: 0.5rem;
  list-style: none;
}

.suggestions li {
  margin: 0.5rem 0;
}

.suggestions a {
  color: #667eea;
  text-decoration: none;
}
</style>