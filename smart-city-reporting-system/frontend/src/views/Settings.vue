<template>
  <div class="settings-page">
    <div class="page-header">
      <h1><i class="fas fa-cog"></i> Settings</h1>
      <p>Customize your application preferences</p>
    </div>

    <div class="settings-grid">
      <div class="settings-card">
        <h2><i class="fas fa-bell"></i> Notifications</h2>
        <div class="setting-item">
          <label class="switch-label">
            <span>Email Notifications</span>
            <label class="switch">
              <input type="checkbox" v-model="settings.emailNotifications">
              <span class="slider"></span>
            </label>
          </label>
        </div>
        <div class="setting-item">
          <label class="switch-label">
            <span>Push Notifications</span>
            <label class="switch">
              <input type="checkbox" v-model="settings.pushNotifications">
              <span class="slider"></span>
            </label>
          </label>
        </div>
        <div class="setting-item">
          <label class="switch-label">
            <span>SMS Alerts</span>
            <label class="switch">
              <input type="checkbox" v-model="settings.smsAlerts">
              <span class="slider"></span>
            </label>
          </label>
        </div>
      </div>

      <div class="settings-card">
        <h2><i class="fas fa-palette"></i> Appearance</h2>
        <div class="setting-item">
          <label>Theme</label>
          <select v-model="settings.theme">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div class="setting-item">
          <label>Font Size</label>
          <input type="range" v-model="settings.fontSize" min="12" max="20" step="1">
          <span>{{ settings.fontSize }}px</span>
        </div>
      </div>

      <div class="settings-card">
        <h2><i class="fas fa-globe"></i> Language & Region</h2>
        <div class="setting-item">
          <label>Language</label>
          <select v-model="settings.language">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
          </select>
        </div>
        <div class="setting-item">
          <label>Time Zone</label>
          <select v-model="settings.timezone">
            <option value="IST">IST (UTC+5:30)</option>
            <option value="EST">EST (UTC-5)</option>
            <option value="PST">PST (UTC-8)</option>
          </select>
        </div>
      </div>

      <div class="settings-card">
        <h2><i class="fas fa-chart-line"></i> Privacy</h2>
        <div class="setting-item">
          <label class="switch-label">
            <span>Show my location on reports</span>
            <label class="switch">
              <input type="checkbox" v-model="settings.showLocation">
              <span class="slider"></span>
            </label>
          </label>
        </div>
        <div class="setting-item">
          <label class="switch-label">
            <span>Allow data collection for analytics</span>
            <label class="switch">
              <input type="checkbox" v-model="settings.analytics">
              <span class="slider"></span>
            </label>
          </label>
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="save-btn" @click="saveSettings">
        <i class="fas fa-save"></i> Save All Settings
      </button>
      <button class="reset-btn" @click="resetSettings">
        <i class="fas fa-undo"></i> Reset to Default
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'Settings',
  setup() {
    const defaultSettings = {
      emailNotifications: true,
      pushNotifications: true,
      smsAlerts: false,
      theme: 'light',
      fontSize: 14,
      language: 'en',
      timezone: 'IST',
      showLocation: true,
      analytics: true
    }

    const settings = ref({ ...defaultSettings })

    const loadSettings = () => {
      const saved = localStorage.getItem('userSettings')
      if (saved) {
        settings.value = { ...defaultSettings, ...JSON.parse(saved) }
      }
      applyTheme()
      applyFontSize()
    }

    const saveSettings = () => {
      localStorage.setItem('userSettings', JSON.stringify(settings.value))
      applyTheme()
      applyFontSize()
      alert('Settings saved successfully!')
    }

    const resetSettings = () => {
      if (confirm('Reset all settings to default?')) {
        settings.value = { ...defaultSettings }
        saveSettings()
      }
    }

    const applyTheme = () => {
      if (settings.value.theme === 'dark') {
        document.body.classList.add('dark-mode')
      } else if (settings.value.theme === 'light') {
        document.body.classList.remove('dark-mode')
      }
    }

    const applyFontSize = () => {
      document.documentElement.style.fontSize = `${settings.value.fontSize}px`
    }

    onMounted(() => {
      loadSettings()
    })

    return { settings, saveSettings, resetSettings }
  }
}
</script>

<style scoped>
.settings-page {
  padding: 2rem;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 2rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.settings-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.settings-card h2 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.setting-item {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #667eea;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

select, input[type="range"] {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.save-btn, .reset-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.reset-btn {
  background: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>