<template>
  <div class="report-card" :data-status="report.status" @click="viewDetails">
    <div class="card-header">
      <div class="category-badge">
        <i :class="getCategoryIcon(report.category)"></i>
        <span>{{ formatCategory(report.category) }}</span>
      </div>
      <StatusBadge :status="report.status" />
    </div>

    <h3 class="report-title">{{ report.title }}</h3>
    <p class="report-description">{{ truncateText(report.description, 100) }}</p>

    <div class="card-footer">
      <div class="location-info">
        <i class="fas fa-map-marker-alt"></i>
        <span>{{ report.location?.address || 'Location not specified' }}</span>
      </div>
      <div class="date-info">
        <i class="far fa-calendar-alt"></i>
        <span>{{ formatDate(report.createdAt) }}</span>
      </div>
    </div>

    <div class="card-stats">
      <div class="stat">
        <i class="fas fa-comment"></i>
        <span>{{ report.comments?.length || 0 }} Comments</span>
      </div>
      <div class="stat">
        <i class="fas fa-chart-simple"></i>
        <span>{{ getPriorityLabel(report.priority) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import StatusBadge from './StatusBadge.vue'
import { formatDate } from '@/utils/formatDate'

export default {
  name: 'ReportCard',
  components: { StatusBadge },
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      return formatDate(date, 'MMM DD, YYYY')
    },
    truncateText(text, length) {
      if (text.length <= length) return text
      return text.substring(0, length) + '...'
    },
    getCategoryIcon(category) {
      const icons = {
        roads: 'fas fa-road',
        drainage: 'fas fa-water',
        electricity: 'fas fa-bolt',
        water: 'fas fa-tint',
        waste: 'fas fa-trash',
        other: 'fas fa-ellipsis-h'
      }
      return icons[category] || 'fas fa-tag'
    },
    formatCategory(category) {
      const categories = {
        roads: 'Roads',
        drainage: 'Drainage',
        electricity: 'Electricity',
        water: 'Water Supply',
        waste: 'Waste Management',
        other: 'Other'
      }
      return categories[category] || category
    },
    getPriorityLabel(priority) {
      const labels = {
        low: 'Low Priority',
        medium: 'Medium Priority',
        high: 'High Priority',
        urgent: 'Urgent'
      }
      return labels[priority] || priority
    },
    viewDetails() {
      this.$router.push(`/reports/${this.report._id}`)
    }
  }
}
</script>

<style scoped>
.report-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
}

.report-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.category-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  border-radius: 20px;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.category-badge i {
  font-size: 0.875rem;
  margin: 0;
}

.report-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
  font-family: 'Inter', sans-serif;
}

.report-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.location-info i,
.date-info i {
  margin-right: 0.25rem;
  font-size: 0.75rem;
}

.card-stats {
  display: flex;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.stat i {
  font-size: 0.75rem;
  margin: 0;
}

/* Status-based border colors */
.report-card[data-status="pending"] {
  border-left: 4px solid #f59e0b;
}

.report-card[data-status="in-progress"] {
  border-left: 4px solid #3b82f6;
}

.report-card[data-status="resolved"] {
  border-left: 4px solid #10b981;
}

.report-card[data-status="rejected"] {
  border-left: 4px solid #ef4444;
}
</style>