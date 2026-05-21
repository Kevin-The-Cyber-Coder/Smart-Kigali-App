<template>
  <div class="about-page">
    <section class="hero-section">
      <div class="container">
        <h1><i class="fas fa-info-circle"></i> About Smart City Initiative</h1>
        <p>Transforming urban living through technology and citizen participation</p>
      </div>
    </section>

    <section class="mission-section">
      <div class="container">
        <div class="mission-card">
          <i class="fas fa-bullseye"></i>
          <h2>Our Mission</h2>
          <p>To create a connected, sustainable, and citizen-centric urban ecosystem where every resident can actively participate in city governance and improvement.</p>
        </div>
        <div class="vision-card">
          <i class="fas fa-eye"></i>
          <h2>Our Vision</h2>
          <p>A future where technology bridges the gap between citizens and administration, enabling real-time problem solving and data-driven urban development.</p>
        </div>
      </div>
    </section>

    <section class="values-section">
      <h2><i class="fas fa-heart"></i> Our Core Values</h2>
      <div class="values-grid">
        <div class="value-card">
          <i class="fas fa-hand-holding-heart"></i>
          <h3>Citizen First</h3>
          <p>We prioritize citizen needs and feedback</p>
        </div>
        <div class="value-card">
          <i class="fas fa-chart-line"></i>
          <h3>Transparency</h3>
          <p>Complete visibility of issue resolution process</p>
        </div>
        <div class="value-card">
          <i class="fas fa-bolt"></i>
          <h3>Efficiency</h3>
          <p>Fast and effective problem solving</p>
        </div>
        <div class="value-card">
          <i class="fas fa-leaf"></i>
          <h3>Sustainability</h3>
          <p>Eco-friendly urban development solutions</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about-page {
  animation: fadeIn 0.5s ease;
}

.hero-section {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.mission-section {
  padding: 4rem 2rem;
  background: white;
}

.mission-card, .vision-card {
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s;
}

.mission-card {
  background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
  color: white;
}

.vision-card {
  background: #f8fafc;
  border: 2px solid #0ea5e9;
}

.mission-card i, .vision-card i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.values-section {
  padding: 4rem 2rem;
  background: #f0f9ff;
}

.values-section h2 {
  text-align: center;
  margin-bottom: 3rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.value-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  transition: all 0.3s;
}

.value-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.value-card i {
  font-size: 2.5rem;
  color: #0ea5e9;
  margin-bottom: 1rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}
</style>