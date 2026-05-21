<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <i class="fas fa-user-plus"></i>
        <h2>Create Account</h2>
        <p>Join Smart Kigali community</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <i class="fas fa-user"></i>
          <input type="text" v-model="name" placeholder="Full Name" required>
        </div>

        <div class="form-group">
          <i class="fas fa-envelope"></i>
          <input type="email" v-model="email" placeholder="Email Address" required>
        </div>

        <div class="form-group">
          <i class="fas fa-phone"></i>
          <input type="tel" v-model="phone" placeholder="Phone Number (Optional)">
        </div>

        <div class="form-group">
          <i class="fas fa-lock"></i>
          <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password (min 6 characters)" required>
          <button type="button" @click="showPassword = !showPassword" class="password-toggle">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>

        <div class="form-group">
          <i class="fas fa-check-circle"></i>
          <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="Confirm Password" required>
          <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="password-toggle">
            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>

        <label class="checkbox">
          <input type="checkbox" v-model="agreeTerms" required>
          <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
        </label>

        <button type="submit" class="btn-register" :disabled="loading || !agreeTerms">
          <i v-if="loading" class="fas fa-spinner fa-pulse"></i>
          <i v-else class="fas fa-user-check"></i>
          {{ loading ? 'Creating Account...' : 'Register' }}
        </button>

        <div class="auth-footer">
          <p>Already have an account? 
            <router-link to="/login">Login here</router-link>
          </p>
        </div>
      </form>

      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      loading: false,
      error: '',
      showPassword: false,
      showConfirmPassword: false,
      agreeTerms: false
    }
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match'
        return
      }

      if (this.password.length < 6) {
        this.error = 'Password must be at least 6 characters'
        return
      }

      this.loading = true
      this.error = ''
      
      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          phone: this.phone
        })
        
        if (response.data.success) {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          this.$router.push('/dashboard')
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 2rem;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header i {
  font-size: 3rem;
  color: #0ea5e9;
  margin-bottom: 1rem;
}

.auth-header h2 {
  font-size: 1.75rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
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

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s;
  font-family: 'Inter', sans-serif;
}

.form-group input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
  cursor: pointer;
  font-size: 0.875rem;
  color: #64748b;
}

.checkbox a {
  color: #0ea5e9;
  text-decoration: none;
}

.btn-register {
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}
</style>