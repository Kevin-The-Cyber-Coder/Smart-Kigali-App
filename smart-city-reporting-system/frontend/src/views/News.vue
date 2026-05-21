<template>
  <div class="news-page">
    <!-- Hero Section -->
    <section class="news-hero">
      <div class="hero-bg"></div>
      <div class="news-hero-content">
        <h1 data-aos="fade-up">
          <i class="fas fa-newspaper"></i> City Updates
        </h1>
        <p data-aos="fade-up" data-aos-delay="100">
          Stay informed about the latest developments in Kigali
        </p>
      </div>
    </section>

    <!-- Featured News -->
    <section class="featured-news">
      <div class="container">
        <div class="featured-card" data-aos="fade-up">
          <div class="featured-image-placeholder">
            <i class="fas fa-city"></i>
            <span>Featured</span>
          </div>
          <div class="featured-content">
            <span class="category">Breaking News</span>
            <h2>Kigali Named Africa's Smartest City 2024</h2>
            <p>The city receives recognition for its innovative digital transformation and sustainable urban development initiatives...</p>
            <div class="news-meta">
              <span><i class="fas fa-calendar"></i> January 15, 2024</span>
              <span><i class="fas fa-eye"></i> 5,234 views</span>
            </div>
            <a href="#" class="read-more">Read Full Story <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </section>

    <!-- News Grid -->
    <section class="news-grid">
      <div class="container">
        <h2 data-aos="fade-up">
          <i class="fas fa-clock"></i> Latest News
        </h2>
        <div class="news-cards">
          <div class="news-card" v-for="(news, index) in newsList" :key="index" data-aos="fade-up" :data-aos-delay="index * 100">
            <div class="news-image-placeholder">
              <i :class="news.icon"></i>
            </div>
            <div class="news-body">
              <span class="news-category">{{ news.category }}</span>
              <h3>{{ news.title }}</h3>
              <p>{{ news.excerpt }}</p>
              <div class="news-footer">
                <span class="date"><i class="fas fa-calendar-alt"></i> {{ news.date }}</span>
                <a href="#" class="read-link">Read More <i class="fas fa-chevron-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="events">
      <div class="container">
        <h2 data-aos="fade-up">
          <i class="fas fa-calendar-alt"></i> Upcoming Events
        </h2>
        <div class="events-list">
          <div class="event-item" v-for="(event, index) in events" :key="index" data-aos="fade-left" :data-aos-delay="index * 100">
            <div class="event-date">
              <span class="day">{{ event.day }}</span>
              <span class="month">{{ event.month }}</span>
            </div>
            <div class="event-details">
              <h3>{{ event.title }}</h3>
              <p><i class="fas fa-map-marker-alt"></i> {{ event.location }}</p>
              <p><i class="fas fa-clock"></i> {{ event.time }}</p>
            </div>
            <button class="event-btn">Register <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter">
      <div class="container">
        <div class="newsletter-content" data-aos="zoom-in">
          <i class="fas fa-envelope-open-text"></i>
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest city updates delivered to your inbox</p>
          <form @submit.prevent="subscribe" class="newsletter-form">
            <input type="email" v-model="email" placeholder="Enter your email address" required>
            <button type="submit">
              <i class="fas fa-paper-plane"></i> Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AOS from 'aos'
import 'aos/dist/aos.css'

export default {
  name: 'News',
  data() {
    return {
      email: '',
      newsList: [
        {
          icon: 'fas fa-chart-line',
          category: 'Development',
          title: 'New Smart Traffic System Launched',
          excerpt: 'AI-powered traffic management system reduces congestion by 40% in downtown Kigali...',
          date: 'Jan 14, 2024'
        },
        {
          icon: 'fas fa-leaf',
          category: 'Environment',
          title: 'Green Initiative: 10,000 Trees Planted',
          excerpt: 'Community-driven reforestation project reaches milestone ahead of schedule...',
          date: 'Jan 12, 2024'
        },
        {
          icon: 'fas fa-laptop',
          category: 'Technology',
          title: 'Free Wi-Fi Zones Expanded',
          excerpt: '20 new public Wi-Fi hotspots installed across the city...',
          date: 'Jan 10, 2024'
        },
        {
          icon: 'fas fa-hand-holding-heart',
          category: 'Community',
          title: 'Volunteer Clean-up Drive This Weekend',
          excerpt: 'Join fellow citizens in making Kigali cleaner and greener...',
          date: 'Jan 8, 2024'
        },
        {
          icon: 'fas fa-charging-station',
          category: 'Infrastructure',
          title: 'EV Charging Stations Inaugurated',
          excerpt: 'First batch of electric vehicle charging stations now operational...',
          date: 'Jan 5, 2024'
        },
        {
          icon: 'fas fa-award',
          category: 'Awards',
          title: 'Kigali Wins Sustainable City Award',
          excerpt: 'Recognition for outstanding achievements in urban sustainability...',
          date: 'Jan 3, 2024'
        }
      ],
      events: [
        {
          day: '20',
          month: 'JAN',
          title: 'Smart City Expo 2024',
          location: 'Kigali Convention Centre',
          time: '10:00 AM - 6:00 PM'
        },
        {
          day: '25',
          month: 'JAN',
          title: 'Community Clean-up Day',
          location: 'Various Locations',
          time: '8:00 AM - 12:00 PM'
        },
        {
          day: '01',
          month: 'FEB',
          title: 'Digital Skills Workshop',
          location: 'Innovation Hub, Kigali',
          time: '2:00 PM - 5:00 PM'
        }
      ]
    }
  },
  mounted() {
    AOS.init({ duration: 1000, once: true })
  },
  methods: {
    subscribe() {
      alert(`Thank you for subscribing with ${this.email}! You'll receive our latest updates.`)
      this.email = ''
    }
  }
}
</script>

<style scoped>
.news-page {
  font-family: 'Inter', sans-serif;
}

.news-hero {
  position: relative;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
  background-size: cover;
}

.news-hero-content {
  position: relative;
  z-index: 1;
}

.news-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.featured-news {
  padding: 4rem 0;
  background: white;
}

.featured-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background: #f8fafc;
  border-radius: 16px;
  overflow: hidden;
}

.featured-image-placeholder {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.featured-image-placeholder i {
  font-size: 4rem;
  color: white;
}

.featured-image-placeholder span {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #ef4444;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.featured-content {
  padding: 2rem;
}

.category {
  background: #dbeafe;
  color: #0ea5e9;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
}

.featured-content h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1e293b;
}

.news-meta {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  color: #64748b;
  font-size: 0.875rem;
}

.read-more {
  color: #0ea5e9;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.news-grid {
  padding: 4rem 0;
  background: #f8fafc;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #1e293b;
  text-align: center;
}

.news-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.news-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.news-image-placeholder {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.news-image-placeholder i {
  font-size: 3rem;
  color: white;
}

.news-body {
  padding: 1.5rem;
}

.news-category {
  background: #e0f2fe;
  color: #0ea5e9;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.news-body h3 {
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.news-body p {
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.read-link {
  color: #0ea5e9;
  text-decoration: none;
  font-size: 0.875rem;
}

.events {
  padding: 4rem 0;
  background: white;
}

.events-list {
  max-width: 800px;
  margin: 0 auto;
}

.event-item {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.event-date {
  text-align: center;
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  min-width: 80px;
}

.event-date .day {
  font-size: 1.5rem;
  font-weight: 700;
  display: block;
}

.event-date .month {
  font-size: 0.75rem;
}

.event-details {
  flex: 1;
}

.event-details h3 {
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.event-details p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0;
}

.event-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.newsletter {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  padding: 4rem 2rem;
  color: white;
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-content i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.newsletter-form {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.newsletter-form input {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
}

.newsletter-form button {
  padding: 0.75rem 1.5rem;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

@media (max-width: 768px) {
  .featured-card {
    grid-template-columns: 1fr;
  }
  
  .news-cards {
    grid-template-columns: 1fr;
  }
  
  .event-item {
    flex-direction: column;
    text-align: center;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
}
</style>