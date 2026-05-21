<template>
  <div class="dashboard-layout">
    <Sidebar />
    <div class="main-content" :class="{ collapsed: sidebarCollapsed }">
      <Navbar />
      <div class="content-wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'DashboardLayout',
  components: { Sidebar, Navbar },
  setup() {
    const sidebarCollapsed = ref(false)
    
    onMounted(() => {
      const saved = localStorage.getItem('sidebarCollapsed')
      sidebarCollapsed.value = saved === 'true'
    })
    
    return { sidebarCollapsed }
  }
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s;
}

.main-content.collapsed {
  margin-left: 70px;
}

.content-wrapper {
  padding: 1rem;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 70px;
  }
}
</style>