<template>
  <div class="overview-page">
    <div class="page-header">
      <h1><i class="fas fa-chart-line"></i> Analytics Overview</h1>
      <p>Comprehensive insights into city issues and resolutions</p>
    </div>

    <div class="filters">
      <select v-model="timeRange" class="filter-select">
        <option value="week">Last 7 Days</option>
        <option value="month">Last 30 Days</option>
        <option value="quarter">Last 3 Months</option>
        <option value="year">Last Year</option>
      </select>
      <select v-model="district" class="filter-select">
        <option value="">All Districts</option>
        <option value="north">North District</option>
        <option value="south">South District</option>
        <option value="east">East District</option>
        <option value="west">West District</option>
      </select>
    </div>

    <div class="charts-grid">
      <div class="chart-card" data-aos="fade-up">
        <ChartBox 
          title="Reports by Category"
          icon="fas fa-chart-pie"
          :data="categoryData"
          type="pie"
        />
      </div>
      <div class="chart-card" data-aos="fade-up" data-aos-delay="100">
        <ChartBox 
          title="Resolution Trends"
          icon="fas fa-chart-line"
          :data="trendData"
          type="line"
        />
      </div>
      <div class="chart-card" data-aos="fade-up" data-aos-delay="200">
        <ChartBox 
          title="Status Distribution"
          icon="fas fa-chart-bar"
          :data="statusData"
          type="bar"
        />
      </div>
      <div class="chart-card" data-aos="fade-up" data-aos-delay="300">
        <ChartBox 
          title="Response Time (Hours)"
          icon="fas fa-clock"
          :data="responseTimeData"
          type="doughnut"
        />
      </div>
    </div>

    <div class="insights-section" data-aos="fade-up">
      <h2><i class="fas fa-lightbulb"></i> Key Insights</h2>
      <div class="insights-grid">
        <div class="insight-card">
          <i class="fas fa-chart-line"></i>
          <div class="insight-content">
            <h3>Peak Reporting Time</h3>
            <p>Monday mornings (9 AM - 11 AM) see the highest number of reports</p>
          </div>
        </div>
        <div class="insight-card">
          <i class="fas fa-tachometer-alt"></i>
          <div class="insight-content">
            <h3>Fastest Resolution</h3>
            <p>Road maintenance issues resolved within 24 hours on average</p>
          </div>
        </div>
        <div class="insight-card">
          <i class="fas fa-exclamation-triangle"></i>
          <div class="insight-content">
            <h3>Most Critical Area</h3>
            <p>Drainage issues remain the top concern in downtown area</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import ChartBox from '@/components/ChartBox.vue'
import AOS from 'aos'

export default {
  name: 'Overview',
  components: { ChartBox },
  setup() {
    const timeRange = ref('month')
    const district = ref('')

    const categoryData = ref({
      labels: ['Roads', 'Drainage', 'Electricity', 'Water', 'Waste', 'Other'],
      datasets: [{
        data: [35, 25, 15, 12, 8, 5],
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f59e0b',
          '#10b981',
          '#ef4444',
          '#3b82f6'
        ]
      }]
    })

    const trendData = ref({
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Reported',
          data: [45, 52, 48, 55],
          borderColor: '#ef4444',
          tension: 0.4
        },
        {
          label: 'Resolved',
          data: [38, 42, 45, 50],
          borderColor: '#10b981',
          tension: 0.4
        }
      ]
    })

    const statusData = ref({
      labels: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      datasets: [{
        label: 'Reports',
        data: [25, 30, 40, 5],
        backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444']
      }]
    })

    const responseTimeData = ref({
      labels: ['< 24hrs', '24-48hrs', '48-72hrs', '> 72hrs'],
      datasets: [{
        data: [45, 30, 15, 10],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
      }]
    })

    AOS.init({ duration: 1000, once: true })

    return {
      timeRange,
      district,
      categoryData,
      trendData,
      statusData,
      responseTimeData
    }
  }
}
</script>

<style scoped>
.overview-page {
  padding: 2rem;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.875rem;
  margin-bottom: 0.5rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  background: white;
  cursor: pointer;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.insights-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.insights-section h2 {
  margin-bottom: 1.5rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.insight-card i {
  font-size: 1.5rem;
  color: #667eea;
}

.insight-content h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.insight-content p {
  font-size: 0.875rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .filters {
    flex-direction: column;
  }
}
</style>