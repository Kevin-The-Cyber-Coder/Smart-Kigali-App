<template>
  <div class="report-page">
    <!-- Hero Section -->
    <section class="report-hero">
      <div class="hero-bg"></div>
      <div class="report-hero-content">
        <h1 data-aos="fade-up">
          <i class="fas fa-flag-checkered"></i> Report an Issue
        </h1>
        <p data-aos="fade-up" data-aos-delay="100">
          Help us make Kigali better by reporting civic issues
        </p>
      </div>
    </section>

    <!-- Report Form -->
    <section class="report-form-section">
      <div class="container">
        <div class="form-container" data-aos="fade-up">
          <div class="progress-steps">
            <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
              <div class="step-number">1</div>
              <span>Issue Details</span>
            </div>
            <div class="step-line"></div>
            <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
              <div class="step-number">2</div>
              <span>Location</span>
            </div>
            <div class="step-line"></div>
            <div class="step" :class="{ active: currentStep >= 3 }">
              <div class="step-number">3</div>
              <span>Media & Submit</span>
            </div>
          </div>

          <form @submit.prevent="submitReport" class="report-form">
            <!-- Step 1: Issue Details -->
            <div v-show="currentStep === 1" class="form-step">
              <h2><i class="fas fa-info-circle"></i> Issue Details</h2>
              
              <div class="form-group">
                <label>Issue Title <span class="required">*</span></label>
                <input type="text" v-model="report.title" required placeholder="e.g., Pothole on Main Street">
              </div>

              <div class="form-group">
                <label>Description <span class="required">*</span></label>
                <textarea v-model="report.description" rows="5" required placeholder="Please provide detailed description of the issue..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Category <span class="required">*</span></label>
                  <select v-model="report.category" required>
                    <option value="">Select Category</option>
                    <option value="roads">🚗 Roads & Potholes</option>
                    <option value="drainage">💧 Drainage & Sewage</option>
                    <option value="electricity">⚡ Electricity & Lighting</option>
                    <option value="water">💦 Water Supply</option>
                    <option value="waste">🗑️ Waste Management</option>
                    <option value="noise">🔊 Noise Pollution</option>
                    <option value="security">🚔 Security Issues</option>
                    <option value="other">📌 Other</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Priority <span class="required">*</span></label>
                  <select v-model="report.priority" required>
                    <option value="low">🟢 Low - Minor issue, no immediate danger</option>
                    <option value="medium">🟡 Medium - Needs attention soon</option>
                    <option value="high">🟠 High - Urgent, affects daily life</option>
                    <option value="urgent">🔴 Urgent - Emergency, immediate action needed</option>
                  </select>
                </div>
              </div>

              <button type="button" class="next-btn" @click="nextStep">
                Next: Location <i class="fas fa-arrow-right"></i>
              </button>
            </div>

            <!-- Step 2: Location -->
            <div v-show="currentStep === 2" class="form-step">
              <h2><i class="fas fa-map-marker-alt"></i> Location Details</h2>

              <div class="location-picker">
                <button type="button" class="location-btn" @click="getCurrentLocation">
                  <i class="fas fa-location-dot"></i> Use My Current Location
                </button>
                <div class="location-placeholder">
                  <i class="fas fa-map"></i>
                  <p>Map will appear here (Integration with mapping service)</p>
                </div>
              </div>

              <div class="form-group">
                <label>Street Address</label>
                <input type="text" v-model="report.address" placeholder="Enter street address">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Sector/District</label>
                  <select v-model="report.district">
                    <option value="">Select District</option>
                    <option value="gasabo">Gasabo</option>
                    <option value="kicukiro">Kicukiro</option>
                    <option value="nyarugenge">Nyarugenge</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Nearest Landmark</label>
                  <input type="text" v-model="report.landmark" placeholder="e.g., Near KCC">
                </div>
              </div>

              <div class="button-group">
                <button type="button" class="prev-btn" @click="prevStep">
                  <i class="fas fa-arrow-left"></i> Back
                </button>
                <button type="button" class="next-btn" @click="nextStep">
                  Next: Media <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <!-- Step 3: Media & Submit -->
            <div v-show="currentStep === 3" class="form-step">
              <h2><i class="fas fa-image"></i> Add Media (Optional)</h2>

              <div class="upload-area" @click="triggerFileUpload">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Click to upload photos or videos</p>
                <small>Supports JPG, PNG, MP4 (Max 10MB)</small>
                <input type="file" ref="fileInput" @change="handleFileUpload" multiple accept="image/*,video/*" style="display: none">
              </div>

              <div v-if="files.length > 0" class="preview-grid">
                <div v-for="(file, index) in files" :key="index" class="preview-item">
                  <i class="fas fa-image"></i>
                  <span>{{ file.name }}</span>
                  <button type="button" @click="removeFile(index)" class="remove-file">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Additional Comments</label>
                <textarea v-model="report.comments" rows="3" placeholder="Any other information that might help..."></textarea>
              </div>

              <div class="button-group">
                <button type="button" class="prev-btn" @click="prevStep">
                  <i class="fas fa-arrow-left"></i> Back
                </button>
                <button type="submit" class="submit-btn" :disabled="submitting">
                  <i v-if="submitting" class="fas fa-spinner fa-pulse"></i>
                  <i v-else class="fas fa-paper-plane"></i>
                  {{ submitting ? 'Submitting...' : 'Submit Report' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Guidelines -->
    <section class="guidelines">
      <div class="container">
        <h2 data-aos="fade-up">
          <i class="fas fa-lightbulb"></i> Reporting Guidelines
        </h2>
        <div class="guidelines-grid">
          <div class="guideline-card" data-aos="zoom-in">
            <i class="fas fa-camera"></i>
            <h3>Clear Photos</h3>
            <p>Upload clear photos of the issue for faster resolution</p>
          </div>
          <div class="guideline-card" data-aos="zoom-in" data-aos-delay="100">
            <i class="fas fa-map-marker-alt"></i>
            <h3>Accurate Location</h3>
            <p>Provide precise location to help our team locate the issue</p>
          </div>
          <div class="guideline-card" data-aos="zoom-in" data-aos-delay="200">
            <i class="fas fa-clock"></i>
            <h3>Timely Reporting</h3>
            <p>Report issues as soon as you notice them for quick action</p>
          </div>
          <div class="guideline-card" data-aos="zoom-in" data-aos-delay="300">
            <i class="fas fa-heart"></i>
            <h3>Be Respectful</h3>
            <p>Provide constructive information to help resolve issues</p>
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
  name: 'Report',
  data() {
    return {
      currentStep: 1,
      submitting: false,
      files: [],
      report: {
        title: '',
        description: '',
        category: '',
        priority: '',
        address: '',
        district: '',
        landmark: '',
        comments: '',
        location: null
      }
    }
  },
  mounted() {
    AOS.init({ duration: 1000, once: true })
  },
  methods: {
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.report.location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            alert('Location detected! You can now add more details.')
          },
          (error) => {
            alert('Unable to get location. Please enter address manually.')
          }
        )
      } else {
        alert('Geolocation is not supported by your browser')
      }
    },
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },
    handleFileUpload(event) {
      const selectedFiles = Array.from(event.target.files)
      this.files.push(...selectedFiles)
    },
    removeFile(index) {
      this.files.splice(index, 1)
    },
    async submitReport() {
      this.submitting = true
      // Simulate API call
      setTimeout(() => {
        alert('✅ Report submitted successfully! Thank you for helping make Kigali better. You will receive updates on your report.')
        this.resetForm()
        this.submitting = false
        this.$router.push('/dashboard')
      }, 2000)
    },
    resetForm() {
      this.currentStep = 1
      this.report = {
        title: '',
        description: '',
        category: '',
        priority: '',
        address: '',
        district: '',
        landmark: '',
        comments: '',
        location: null
      }
      this.files = []
    }
  }
}
</script>

<style scoped>
.report-page {
  font-family: 'Inter', sans-serif;
}

.report-hero {
  position: relative;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  min-height: 40vh;
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

.report-hero-content {
  position: relative;
  z-index: 1;
}

.report-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.report-form-section {
  padding: 4rem 2rem;
  background: #f8fafc;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.form-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0 2rem;
}

.step {
  text-align: center;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  font-weight: 700;
  color: #64748b;
}

.step.active .step-number {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
}

.step.completed .step-number {
  background: #10b981;
  color: white;
}

.step.completed .step-number::after {
  content: '✓';
}

.step-line {
  width: 60px;
  height: 2px;
  background: #e2e8f0;
  margin: 0 0.5rem;
}

.form-step h2 {
  margin-bottom: 2rem;
  color: #1e293b;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1e293b;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.location-picker {
  margin-bottom: 1.5rem;
}

.location-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 0.75rem;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
}

.location-placeholder {
  background: #f1f5f9;
  height: 200px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.location-placeholder i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #0ea5e9;
  background: #f0f9ff;
}

.upload-area i {
  font-size: 3rem;
  color: #0ea5e9;
  margin-bottom: 0.5rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.preview-item {
  background: #f1f5f9;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
}

.remove-file {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.next-btn, .prev-btn, .submit-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.next-btn, .submit-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
  border: none;
  flex: 1;
}

.prev-btn {
  background: #e2e8f0;
  border: none;
  color: #1e293b;
  flex: 1;
}

.guidelines {
  padding: 4rem 2rem;
  background: white;
}

.guidelines h2 {
  text-align: center;
  margin-bottom: 3rem;
}

.guidelines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.guideline-card {
  text-align: center;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
}

.guideline-card i {
  font-size: 2.5rem;
  color: #0ea5e9;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .progress-steps {
    flex-direction: column;
    gap: 1rem;
  }
  
  .step-line {
    width: 2px;
    height: 30px;
  }
  
  .report-hero h1 {
    font-size: 2rem;
  }
}
</style>