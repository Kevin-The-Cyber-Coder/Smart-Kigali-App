<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <div class="logo" @click="$router.push('/')">
        <i class="fas fa-city"></i>
        <span v-if="!isCollapsed">SmartCity</span>
      </div>
      <button @click="toggleSidebar" class="toggle-btn">
        <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-link" :title="isCollapsed ? 'Dashboard' : ''">
        <i class="fas fa-tachometer-alt"></i>
        <span v-if="!isCollapsed">Dashboard</span>
      </router-link>

      <router-link to="/overview" class="nav-link" :title="isCollapsed ? 'Overview' : ''">
        <i class="fas fa-chart-line"></i>
        <span v-if="!isCollapsed">Overview</span>
      </router-link>

      <router-link to="/reports" class="nav-link" :title="isCollapsed ? 'Reports' : ''">
        <i class="fas fa-file-alt"></i>
        <span v-if="!isCollapsed">Reports</span>
      </router-link>

      <router-link to="/map" class="nav-link" :title="isCollapsed ? 'Map View' : ''">
        <i class="fas fa-map-marker-alt"></i>
        <span v-if="!isCollapsed">Map View</span>
      </router-link>

      <router-link to="/analytics" class="nav-link" :title="isCollapsed ? 'Analytics' : ''">
        <i class="fas fa-chart-bar"></i>
        <span v-if="!isCollapsed">Analytics</span>
      </router-link>

      <div class="nav-divider" v-if="!isCollapsed"></div>

      <router-link to="/profile" class="nav-link" :title="isCollapsed ? 'Profile' : ''">
        <i class="fas fa-user"></i>
        <span v-if="!isCollapsed">Profile</span>
      </router-link>

      <router-link to="/settings" class="nav-link" :title="isCollapsed ? 'Settings' : ''">
        <i class="fas fa-cog"></i>
        <span v-if="!isCollapsed">Settings</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button @click="handleLogout" class="logout-btn" :title="isCollapsed ? 'Logout' : ''">
        <i class="fas fa-sign-out-alt"></i>
        <span v-if="!isCollapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

export default {
  name: 'Sidebar',
  setup() {
    const isCollapsed = ref(false)
    const router = useRouter()
    const authStore = useAuthStore()

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
      localStorage.setItem('sidebarCollapsed', isCollapsed.value)
    }

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/auth/login')
    }

    // Load saved state
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      isCollapsed.value = savedState === 'true'
    }

    return { isCollapsed, toggleSidebar, handleLogout }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  width: 260px;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.logo i {
  font-size: 1.5rem;
  margin: 0;
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 5px;
  transition: background 0.3s;
}

.toggle-btn:hover {
  background: rgba(255,255,255,0.1);
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  transition: all 0.3s;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.nav-link i {
  width: 20px;
  margin: 0;
  font-size: 1.1rem;
}

.nav-link:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-divider {
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin: 1rem 0;
}

.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.logout-btn:hover {
  background: rgba(220, 38, 38, 0.8);
}

.sidebar.collapsed .nav-link span,
.sidebar.collapsed .logo span,
.sidebar.collapsed .logout-btn span {
  display: none;
}

.sidebar.collapsed .nav-link {
  justify-content: center;
  padding: 0.75rem;
}

.sidebar.collapsed .nav-link i {
  margin: 0;
  font-size: 1.2rem;
}

.sidebar.collapsed .logout-btn {
  justify-content: center;
}

.sidebar.collapsed .logout-btn i {
  margin: 0;
}
</style>