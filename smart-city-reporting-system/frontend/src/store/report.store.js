import { defineStore } from 'pinia'
import reportService from '@/services/report.service'

export const useReportStore = defineStore('report', {
  state: () => ({
    reports: [],
    currentReport: null,
    statistics: {
      pending: 0,
      inProgress: 0,
      resolved: 0,
      total: 0
    },
    isLoading: false
  }),
  
  actions: {
    async fetchReports(filters = {}) {
      this.isLoading = true
      try {
        const response = await reportService.getAll(filters)
        this.reports = response.data
        this.updateStatistics()
      } finally {
        this.isLoading = false
      }
    },
    
    async createReport(reportData) {
      const response = await reportService.create(reportData)
      this.reports.unshift(response.data)
      this.updateStatistics()
      return response.data
    },
    
    async updateReportStatus(id, status) {
      const response = await reportService.updateStatus(id, status)
      const index = this.reports.findIndex(r => r._id === id)
      if (index !== -1) {
        this.reports[index] = response.data
      }
      this.updateStatistics()
      return response.data
    },
    
    updateStatistics() {
      this.statistics = {
        total: this.reports.length,
        pending: this.reports.filter(r => r.status === 'pending').length,
        inProgress: this.reports.filter(r => r.status === 'in-progress').length,
        resolved: this.reports.filter(r => r.status === 'resolved').length
      }
    }
  }
})