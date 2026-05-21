<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="profile-cover"></div>
      <div class="profile-info">
        <div class="avatar">
          <img :src="user?.avatar || 'https://via.placeholder.com/120'" alt="Avatar">
          <button class="change-avatar" @click="changeAvatar">
            <i class="fas fa-camera"></i>
          </button>
        </div>
        <div class="details">
          <h1>{{ user?.name }}</h1>
          <p><i class="fas fa-envelope"></i> {{ user?.email }}</p>
          <p><i class="fas fa-phone"></i> {{ user?.phone || 'Not provided' }}</p>
          <span class="role-badge">{{ user?.role }}</span>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i> {{ tab.name }}
        </button>
      </div>

      <div class="tab-content">
        <!-- Personal Info Tab -->
        <div v-if="activeTab === 'info'" class="info-tab">
          <form @submit.prevent="updateProfile">
            <div class="form-group">
              <label><i class="fas fa-user"></i> Full Name</label>
              <input type="text" v-model="profileForm.name" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-phone"></i> Phone Number</label>
              <input type="tel" v-model="profileForm.phone">
            </div>
            <div class="form-group">
              <label><i class="fas fa-map-marker-alt"></i> Address</label>
              <textarea v-model="profileForm.address" rows="3"></textarea>
            </div>
            <button type="submit" class="save-btn">
              <i class="fas fa-save"></i> Save Changes
            </button>
          </form>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="security-tab">
          <form @submit.prevent="changePassword">
            <div class="form-group">
              <label><i class="fas fa-lock"></i> Current Password</label>
              <input type="password" v-model="passwordForm.currentPassword" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-key"></i> New Password</label>
              <input type="password" v-model="passwordForm.newPassword" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-check-circle"></i> Confirm New Password</label>
              <input type="password" v-model="passwordForm.confirmPassword" required>
            </div>
            <button type="submit" class="save-btn">
              <i class="fas fa-shield-alt"></i> Update Password
            </button>
          </form>
        </div>

        <!-- Activity Tab -->
        <div v-if="activeTab === 'activity'" class="activity-tab">
          <div class="activity-stats">
            <div class="activity-stat">
              <i class="fas fa-file-alt"></i>
              <div>
                <h3>{{ myReports.length }}</h3>
                <p>Total Reports</p>
              </div>
            </div>
            <div class="activity-stat">
              <i class="fas fa-check-circle"></i>
              <div>
                <h3>{{ resolvedReports.length }}</h3>
                <p>Resolved</p>
              </div>
            </div>
            <div class="activity-stat">
              <i class="fas fa-clock"></i>
              <div>
                <h3>{{ pendingReports.length }}</h3>
                <p>Pending</p>
              </div>
            </div>
          </div>
          
          <h3>Recent Activity</h3>
          <div class="activity-list">
            <div v-for="report in recentActivities" :key="report._id" class="activity-item">
              <i class="fas fa-file-alt"></i>
              <div>
                <p><strong>{{ report.title }}</strong> - {{ report.status }}</p>
                <small>{{ formatDate(report.createdAt) }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth.store'
import { useReportStore } from '@/store/report.store'
import { formatDate } from '@/utils/formatDate'

export default {
  name: 'Profile',
  setup() {
    const authStore = useAuthStore()
    const reportStore = useReportStore()
    const activeTab = ref('info')
    
    const tabs = [
      { id: 'info', name: 'Personal Info', icon: 'fas fa-user' },
      { id: 'security', name: 'Security', icon: 'fas fa-shield-alt' },
      { id: 'activity', name: 'Activity', icon: 'fas fa-history' }
    ]

    const profileForm = ref({
      name: authStore.currentUser?.name || '',
      phone: authStore.currentUser?.phone || '',
      address: authStore.currentUser?.address || ''
    })

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const user = computed(() => authStore.currentUser)
    const myReports = computed(() => reportStore.reports.filter(r => r.reportedBy?._id === user.value?.id))
    const resolvedReports = computed(() => myReports.value.filter(r => r.status === 'resolved'))
    const pendingReports = computed(() => myReports.value.filter(r => r.status === 'pending'))
    const recentActivities = computed(() => myReports.value.slice(0, 5))

    const updateProfile = async () => {
      try {
        await authStore.updateProfile(profileForm.value)
        alert('Profile updated successfully!')
      } catch (error) {
        alert('Error updating profile')
      }
    }

    const changePassword = async () => {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        alert('Passwords do not match!')
        return
      }
      try {
        await authStore.changePassword(passwordForm.value)
        alert('Password changed successfully!')
        passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
      } catch (error) {
        alert('Error changing password')
      }
    }

    const changeAvatar = () => {
      // Implement avatar upload
      alert('Avatar upload feature coming soon!')
    }

    onMounted(async () => {
      await reportStore.fetchReports()
    })

    return {
      user,
      activeTab,
      tabs,
      profileForm,
      passwordForm,
      myReports,
      resolvedReports,
      pendingReports,
      recentActivities,
      updateProfile,
      changePassword,
      changeAvatar,
      formatDate
    }
  }
}
</script>

<style scoped>
.profile-page {
  background: #f5f7fa;
  min-height: 100vh;
}

.profile-header {
  position: relative;
}

.profile-cover {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.profile-info {
  display: flex;
  gap: 2rem;
  padding: 0 2rem;
  transform: translateY(-50px);
}

.avatar {
  position: relative;
}

.avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
}

.change-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #667eea;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}

.details {
  margin-top: 1rem;
}

.details h1 {
  margin-bottom: 0.5rem;
}

.details p {
  margin: 0.25rem 0;
  color: #6b7280;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #667eea;
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.profile-content {
  padding: 2rem;
  margin-top: -2rem;
}

.profile-tabs {
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 2rem;
}

.profile-tabs button {
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  color: #6b7280;
  transition: all 0.3s;
}

.profile-tabs button.active {
  color: #667eea;
  border-bottom: 2px solid #667eea;
  margin-bottom: -2px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.activity-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.activity-stat {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.activity-stat i {
  font-size: 2rem;
  color: #667eea;
}

.activity-list {
  background: white;
  border-radius: 8px;
  padding: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-tabs {
    flex-wrap: wrap;
  }
}
</style>