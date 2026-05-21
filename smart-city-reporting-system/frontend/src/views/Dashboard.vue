<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <h1><i class="fas fa-tachometer-alt"></i> Dashboard</h1>
        <p>Welcome back, {{ user?.name || 'Citizen' }}!</p>
      </div>
      <button class="report-btn" @click="showReportModal = true">
        <i class="fas fa-plus-circle"></i> Report an Issue
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <i class="fas fa-file-alt"></i>
        <div>
          <h3>Total Reports</h3>
          <p class="stat-number">{{ stats.total }}</p>
        </div>
      </div>
      <div class="stat-card warning">
        <i class="fas fa-clock"></i>
        <div>
          <h3>Pending</h3>
          <p class="stat-number">{{ stats.pending }}</p>
        </div>
      </div>
      <div class="stat-card success">
        <i class="fas fa-check-circle"></i>
        <div>
          <h3>Resolved</h3>
          <p class="stat-number">{{ stats.resolved }}</p>
        </div>
      </div>
      <div class="stat-card info">
        <i class="fas fa-chart-line"></i>
        <div>
          <h3>Resolution Rate</h3>
          <p class="stat-number">{{ stats.resolutionRate }}%</p>
        </div>
      </div>
    </div>

    <!-- Recent Reports -->
    <div class="recent-section">
      <div class="section-header">
        <h2><i class="fas fa-history"></i> Recent Reports</h2>
        <button class="view-all" @click="viewAllReports">View All <i class="fas fa-arrow-right"></i></button>
      </div>
      
      <div class="reports-list">
        <div v-if="reports.length === 0" class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>No reports yet. Click "Report an Issue" to get started!</p>
        </div>
        
        <div v-for="report in reports" :key="report.id" class="report-item">
          <div class="report-icon">
            <i :class="getCategoryIcon(report.category)"></i>
          </div>
          <div class="report-details">
            <h3>{{ report.title }}</h3>
            <p>{{ report.description }}</p>
            <div class="report-meta">
              <span :class="`status-badge status-${report.status}`">
                <i :class="getStatusIcon(report.status)"></i>
                {{ report.status }}
              </span>
              <span><i class="fas fa-calendar"></i> {{ formatDate(report.date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <div v-if="showReportModal" class="modal" @click.self="showReportModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-flag"></i> Report an Issue</h2>
          <button class="close-btn" @click="showReportModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="submitReport">
          <div class="form-group">
            <label>Title</label>
            <input type="text" v-model="newReport.title" required placeholder="Brief title of the issue">
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newReport.description" required rows="4" placeholder="Detailed description"></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select v-model="newReport.category">
                <option value="roads">Roads & Potholes</option>
                <option value="drainage">Drainage</option>
                <option value="electricity">Electricity</option>
                <option value="water">Water Supply</option>
                <option value="waste">Waste Management</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Priority</label>
              <select v-model="newReport.priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Location</label>
            <input type="text" v-model="newReport.location" placeholder="Enter location address">
          </div>
          
          <button type="submit" class="submit-btn" :disabled="submitting">
            <i v-if="submitting" class="fas fa-spinner fa-pulse"></i>
            <i v-else class="fas fa-paper-plane"></i>
            {{ submitting ? 'Submitting...' : 'Submit Report' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      user: null,
      showReportModal: false,
      submitting: false,
      stats: {
        total: 0,
        pending: 0,
        resolved: 0,
        resolutionRate: 0
      },
      reports: [],
      newReport: {
        title: '',
        description: '',
        category: 'roads',
        priority: 'medium',
        location: ''
      }
    }
  },
  mounted() {
    const userData = localStorage.getItem('user')
    if (userData) {
      this.user = JSON.parse(userData)
    }
    this.loadSampleData()
  },
  methods: {
    loadSampleData() {
      // Sample data for demonstration
      this.stats = {
        total: 12,
        pending: 4,
        resolved: 8,
        resolutionRate: 67
      }
      
      this.reports = [
        {
          id: 1,
          title: 'Pothole on Main Street',
          description: 'Large pothole causing traffic issues',
          category: 'roads',
          status: 'in-progress',
          date: '2024-01-15'
        },
        {
          id: 2,
          title: 'Street Light Not Working',
          description: 'Light pole #234 has been out for 3 days',
          category: 'electricity',
          status: 'pending',
          date: '2024-01-14'
        },
        {
          id: 3,
          title: 'Garbage Collection Needed',
          description: 'Overflowing bins at Central Park',
          category: 'waste',
          status: 'resolved',
          date: '2024-01-13'
        }
      ]
    },
    
    getCategoryIcon(category) {
      const icons = {
        roads: 'fas fa-road',
        drainage: 'fas fa-water',
        electricity: 'fas fa-bolt',
        water: 'fas fa-tint',
        waste: 'fas fa-trash',
        other: 'fas fa-tag'
      }
      return icons[category] || 'fas fa-tag'
    },
    
    getStatusIcon(status) {
      const icons = {
        pending: 'fas fa-clock',
        'in-progress': 'fas fa-spinner fa-pulse',
        resolved: 'fas fa-check-circle'
      }
      return icons[status] || 'fas fa-circle'
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    
    viewAllReports() {
      alert('View all reports feature coming soon!')
    },
    
    async submitReport() {
      this.submitting = true
      // Simulate API call
      setTimeout(() => {
        alert('Report submitted successfully! Thank you for helping make Kigali better.')
        this.showReportModal = false
        this.newReport = {
          title: '',
          description: '',
          category: 'roads',
          priority: 'medium',
          location: ''
        }
        this.submitting = false
      }, 1500)
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  min-height: calc(100vh - 200px);
  background: #f8fafc;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 1.875rem;
  margin-bottom: 0.25rem;
  color: #1e293b;
}

.report-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.report-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.stat-card i {
  font-size: 2rem;
  color: #0ea5e9;
}

.stat-card h3 {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-card.warning i { color: #f59e0b; }
.stat-card.success i { color: #10b981; }
.stat-card.info i { color: #0ea5e9; }

.recent-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.view-all {
  background: none;
  border: none;
  color: #0ea5e9;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f8fafc;
  transition: all 0.3s;
}

.report-item:hover {
  background: #f1f5f9;
}

.report-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-icon i {
  font-size: 1.25rem;
  color: white;
}

.report-details {
  flex: 1;
}

.report-details h3 {
  margin-bottom: 0.25rem;
  color: #1e293b;
}

.report-details p {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.report-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending {
  background: #fef3c7;
  color: #d97706;
}

.status-in-progress {
  background: #dbeafe;
  color: #2563eb;
}

.status-resolved {
  background: #d1fae5;
  color: #059669;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #64748b;
}

.form-group {
  margin-bottom: 1rem;
  padding: 0 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1e293b;
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
  gap: 0;
}

.submit-btn {
  width: calc(100% - 3rem);
  margin: 1rem 1.5rem 1.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>