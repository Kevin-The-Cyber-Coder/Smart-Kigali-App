class AIClassifierService {
  constructor() {
    // This is a mock service - integrate with actual ML model
    this.categories = ['roads', 'drainage', 'electricity', 'water', 'waste', 'other'];
    this.priorities = ['low', 'medium', 'high', 'urgent'];
  }

  async classifyIssue(title, description) {
    // Mock classification logic
    // In production, integrate with TensorFlow.js or external ML API
    
    const text = (title + ' ' + description).toLowerCase();
    
    // Simple keyword-based classification
    let category = 'other';
    let priority = 'medium';
    
    if (text.includes('road') || text.includes('pothole') || text.includes('street')) {
      category = 'roads';
    } else if (text.includes('drain') || text.includes('sewer') || text.includes('flood')) {
      category = 'drainage';
    } else if (text.includes('electric') || text.includes('power') || text.includes('light')) {
      category = 'electricity';
    } else if (text.includes('water') || text.includes('pipe') || text.includes('leak')) {
      category = 'water';
    } else if (text.includes('waste') || text.includes('garbage') || text.includes('trash')) {
      category = 'waste';
    }
    
    // Priority classification
    if (text.includes('urgent') || text.includes('emergency') || text.includes('danger')) {
      priority = 'urgent';
    } else if (text.includes('high') || text.includes('critical') || text.includes('severe')) {
      priority = 'high';
    } else if (text.includes('minor') || text.includes('small')) {
      priority = 'low';
    }
    
    return { category, priority, confidence: 0.85 };
  }

  async suggestDepartment(category) {
    const departments = {
      roads: 'Public Works Department',
      drainage: 'Water & Sanitation Department',
      electricity: 'Power Distribution Company',
      water: 'Water Supply Board',
      waste: 'Municipal Solid Waste Department',
      other: 'General Administration'
    };
    
    return departments[category] || departments.other;
  }

  async analyzeSentiment(text) {
    // Mock sentiment analysis
    const positive = ['good', 'great', 'excellent', 'satisfied'];
    const negative = ['bad', 'poor', 'terrible', 'horrible', 'angry'];
    
    let score = 0;
    const words = text.toLowerCase().split(' ');
    
    words.forEach(word => {
      if (positive.includes(word)) score += 1;
      if (negative.includes(word)) score -= 1;
    });
    
    const sentiment = score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
    return { sentiment, score };
  }
}

module.exports = new AIClassifierService();