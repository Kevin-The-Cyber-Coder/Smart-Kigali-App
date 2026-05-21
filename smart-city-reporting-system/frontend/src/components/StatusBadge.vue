<template>
  <span class="status-badge" :class="statusClass">
    <i :class="statusIcon"></i>
    <span>{{ statusText }}</span>
  </span>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => ['pending', 'in-progress', 'resolved', 'rejected'].includes(value)
    }
  },
  computed: {
    statusClass() {
      return `status-${this.status}`
    },
    statusText() {
      const texts = {
        pending: 'Pending',
        'in-progress': 'In Progress',
        resolved: 'Resolved',
        rejected: 'Rejected'
      }
      return texts[this.status] || this.status
    },
    statusIcon() {
      const icons = {
        pending: 'fas fa-clock',
        'in-progress': 'fas fa-spinner fa-pulse',
        resolved: 'fas fa-check-circle',
        rejected: 'fas fa-times-circle'
      }
      return icons[this.status] || 'fas fa-question-circle'
    }
  }
}
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.status-badge i {
  font-size: 0.75rem;
  margin: 0;
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

.status-rejected {
  background: #fee2e2;
  color: #dc2626;
}
</style>