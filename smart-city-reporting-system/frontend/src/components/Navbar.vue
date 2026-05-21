<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/">
        <i class="logo"><img src="/logo.png" alt=""></i>
        <span>SmartCity Report</span>
      </router-link>
    </div>
    
    <div class="navbar-menu">
      <router-link to="/dashboard" class="nav-item">Dashboard</router-link>
      <router-link to="/reports" class="nav-item">Reports</router-link>
      <router-link to="/overview" class="nav-item">Overview</router-link>
    </div>
    
    <div class="navbar-end">
      <div class="user-menu" @click="toggleDropdown">
        <img :src="user?.avatar || '/default-avatar.png'" alt="Avatar">
        <span>{{ user?.name }}</span>
        <div v-if="showDropdown" class="dropdown">
          <router-link to="/profile">Profile</router-link>
          <router-link to="/settings">Settings</router-link>
          <button @click="handleLogout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/store/auth.store'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const showDropdown = ref(false)
    
    const user = computed(() => authStore.currentUser)
    
    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }
    
    const handleLogout = async () => {
      await authStore.logout()
      router.push('/auth/login')
    }
    
    return { user, showDropdown, toggleDropdown, handleLogout }
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.navbar-brand a {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  font-size: 1.8rem;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.3s;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
}

.user-menu {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-menu img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  color: #333;
  min-width: 150px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
}

.dropdown a, .dropdown button {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown a:hover, .dropdown button:hover {
  background: #f0f0f0;
}
</style>