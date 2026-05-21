<template>
  <div class="chart-box" :class="{ 'dark-mode': darkMode }">
    <div class="chart-header">
      <h3>
        <i :class="icon"></i>
        {{ title }}
      </h3>
      <div class="chart-actions">
        <button @click="toggleType" class="chart-btn" title="Toggle Chart Type">
          <i class="fas fa-chart-line"></i>
        </button>
        <button @click="downloadChart" class="chart-btn" title="Download">
          <i class="fas fa-download"></i>
        </button>
      </div>
    </div>
    <div class="chart-body">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'ChartBox',
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'fas fa-chart-line'
    },
    data: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'line',
      validator: (value) => ['line', 'bar', 'pie', 'doughnut'].includes(value)
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null
    const currentType = ref(props.type)

    const createChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
      }

      const ctx = chartCanvas.value.getContext('2d')
      
      const colors = {
        line: {
          border: '#667eea',
          background: 'rgba(102, 126, 234, 0.1)'
        },
        bar: {
          background: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)'
          ]
        }
      }

      chartInstance = new Chart(ctx, {
        type: currentType.value,
        data: props.data,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { family: 'Inter', size: 12 }
              }
            },
            tooltip: {
              bodyFont: { family: 'Inter' },
              titleFont: { family: 'Inter', weight: 'bold' }
            }
          },
          scales: currentType.value !== 'pie' && currentType.value !== 'doughnut' ? {
            y: {
              beginAtZero: true,
              grid: {
                color: props.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              },
              ticks: {
                font: { family: 'Inter' }
              }
            },
            x: {
              ticks: {
                font: { family: 'Inter' }
              }
            }
          } : {}
        }
      })
    }

    const toggleType = () => {
      const types = ['line', 'bar', 'pie', 'doughnut']
      const currentIndex = types.indexOf(currentType.value)
      currentType.value = types[(currentIndex + 1) % types.length]
      createChart()
    }

    const downloadChart = () => {
      const link = document.createElement('a')
      link.download = `${props.title.toLowerCase().replace(/\s/g, '-')}-chart.png`
      link.href = chartCanvas.value.toDataURL()
      link.click()
    }

    onMounted(() => {
      createChart()
    })

    watch(() => props.data, () => {
      createChart()
    }, { deep: true })

    return { chartCanvas, toggleType, downloadChart, currentType }
  }
}
</script>

<style scoped>
.chart-box {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.chart-box.dark-mode {
  background: #1f2937;
  color: white;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.chart-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-header h3 i {
  font-size: 1.25rem;
  margin: 0;
}

.chart-actions {
  display: flex;
  gap: 0.5rem;
}

.chart-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s;
  color: #6b7280;
}

.chart-btn:hover {
  background: #f3f4f6;
  color: #667eea;
}

.chart-body {
  position: relative;
  height: 300px;
}

canvas {
  max-height: 300px;
  width: 100% !important;
}
</style>