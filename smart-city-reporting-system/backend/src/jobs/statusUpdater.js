const cron = require('node-cron');
const Report = require('../models/Report');
const notificationService = require('../services/notification.service');

class StatusUpdaterJob {
  constructor() {
    // Run every day at midnight
    this.schedule = '0 0 * * *';
  }

  async execute() {
    console.log('Running status updater job...');
    
    try {
      // Auto-resolve old resolved reports (archive after 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const oldReports = await Report.find({
        status: 'resolved',
        resolvedAt: { $lte: thirtyDaysAgo }
      });
      
      // You might want to move these to an archive collection
      console.log(`Found ${oldReports.length} reports ready for archiving`);
      
      // Send reminders for long-pending reports
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const pendingReports = await Report.find({
        status: 'pending',
        createdAt: { $lte: sevenDaysAgo }
      }).populate('reportedBy');
      
      for (const report of pendingReports) {
        // Send reminder to assigned worker or admin
        if (report.assignedTo) {
          const worker = await User.findById(report.assignedTo);
          if (worker) {
            await notificationService.sendEmail(
              worker.email,
              'Action Required: Pending Report',
              `<p>Report "${report.title}" has been pending for over 7 days. Please take action.</p>`
            );
          }
        }
      }
      
      console.log(`Sent reminders for ${pendingReports.length} pending reports`);
    } catch (error) {
      console.error('Status updater error:', error);
    }
  }
}

module.exports = new StatusUpdaterJob();