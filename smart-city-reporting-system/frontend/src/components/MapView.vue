<template>
  <div class="map-container">
    <div id="map" class="map"></div>
    <div class="map-controls">
      <button @click="centerOnUser" class="control-btn" title="My Location">
        <i class="fas fa-location-dot"></i>
      </button>
      <button @click="toggleHeatmap" class="control-btn" title="Toggle Heatmap">
        <i class="fas fa-fire"></i>
      </button>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getCurrentLocation } from '@/utils/geoLocation'

export default {
  name: 'MapView',
  data() {
    return {
      map: null,
      markers: [],
      heatmapLayer: null,
      showHeatmap: false
    }
  },
  mounted() {
    this.initMap()
    this.loadReports()
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([28.6139, 77.2090], 12)
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(this.map)
    },
    
    async centerOnUser() {
      try {
        const location = await getCurrentLocation()
        this.map.setView([location.lat, location.lng], 14)
        this.addUserMarker(location.lat, location.lng)
      } catch (error) {
        console.error('Error getting location:', error)
        alert('Unable to get your location. Please check permissions.')
      }
    },
    
    addUserMarker(lat, lng) {
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: '<i class="fas fa-user"></i>',
        iconSize: [30, 30],
        popupAnchor: [0, -15]
      })
      
      L.marker([lat, lng], { icon: userIcon })
        .addTo(this.map)
        .bindPopup('Your Location')
        .openPopup()
    },
    
    async loadReports() {
      // Fetch reports from API and add markers
      try {
        const response = await fetch('/api/reports/nearby?lat=28.6139&lng=77.2090&distance=10')
        const data = await response.json()
        
        data.data.forEach(report => {
          if (report.location?.coordinates) {
            this.addReportMarker(report)
          }
        })
      } catch (error) {
        console.error('Error loading reports:', error)
      }
    },
    
    addReportMarker(report) {
      const [lng, lat] = report.location.coordinates
      const statusColors = {
        pending: '#f59e0b',
        'in-progress': '#3b82f6',
        resolved: '#10b981',
        rejected: '#ef4444'
      }
      
      const markerHtml = `
        <div style="background: ${statusColors[report.status]}; 
                    width: 12px; 
                    height: 12px; 
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
        </div>
      `
      
      const icon = L.divIcon({
        html: markerHtml,
        className: 'report-marker',
        iconSize: [12, 12]
      })
      
      const marker = L.marker([lat, lng], { icon })
        .addTo(this.map)
        .bindPopup(`
          <b>${report.title}</b><br>
          Status: ${report.status}<br>
          <a href="/reports/${report._id}">View Details</a>
        `)
      
      this.markers.push(marker)
    },
    
    toggleHeatmap() {
      this.showHeatmap = !this.showHeatmap
      // Implement heatmap logic here
      console.log('Toggle heatmap:', this.showHeatmap)
    }
  }
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  border-radius: 12px;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.map-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.control-btn {
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.3s;
  font-family: 'Inter', sans-serif;
}

.control-btn:hover {
  transform: scale(1.05);
  background: #667eea;
  color: white;
}

.control-btn i {
  font-size: 1.1rem;
  margin: 0;
}
</style>