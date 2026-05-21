const cron = require('node-cron');
const Report = require('../models/Report');
const User = require('../models/User');
const notificationService = require('../services/notification.service');

class AutoAssignJob {
  constructor() {
    // Run every hour
    this.schedule = '0 * * * *';
  }

  async execute() {
    console.log('Running auto-assignment job...');
    
    try {
      // Find unassigned high priority reports older than 1 hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      const unassignedReports = await Report.find({
        assignedTo: { $exists: false },
        priority: { $in: ['high', 'urgent'] },
        createdAt: { $lte: oneHourAgo },
        status: 'pending'
      });
      
      for (const report of unassignedReports) {
        // Find available workers
        const workers = await User.find({ 
          role: 'worker', 
          isActive: true 
        });
        
        if (workers.length > 0) {
          // Round-robin assignment
          const workerIndex = Math.floor(Math.random() * workers.length);
          const assignedWorker = workers[workerIndex];
          
          report.assignedTo = assignedWorker._id;
          report.status = 'in-progress';
          await report.save();
          
          // Send notification
          await notificationService.sendAssignmentNotification(assignedWorker, report);
          console.log(`Assigned report ${report._id} to ${assignedWorker.email}`);
        }
      }
      
      console.log(`Auto-assigned ${unassignedReports.length} reports`);
    } catch (error) {
      console.error('Auto-assignment error:', error);
    }
  }
}

module.exports = new AutoAssignJob();