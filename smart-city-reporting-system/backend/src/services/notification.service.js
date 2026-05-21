const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, html) {
    try {
      await this.transporter.sendMail({
        from: `"Smart City System" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      });
      return true;
    } catch (error) {
      console.error('Email error:', error);
      return false;
    }
  }

  async sendStatusUpdate(user, report) {
    const subject = `Report Status Update: ${report.title}`;
    const html = `
      <h2>Hello ${user.name},</h2>
      <p>Your report "${report.title}" has been updated to: <strong>${report.status}</strong></p>
      <p>View your report: <a href="${process.env.FRONTEND_URL}/reports/${report._id}">Click here</a></p>
      <br>
      <p>Thank you for helping make our city smarter!</p>
    `;
    return this.sendEmail(user.email, subject, html);
  }

  async sendAssignmentNotification(worker, report) {
    const subject = `New Report Assigned: ${report.title}`;
    const html = `
      <h2>Hello ${worker.name},</h2>
      <p>A new report has been assigned to you:</p>
      <p><strong>Title:</strong> ${report.title}</p>
      <p><strong>Priority:</strong> ${report.priority}</p>
      <p><strong>Location:</strong> ${report.location?.address || 'Not specified'}</p>
      <p>View and update: <a href="${process.env.FRONTEND_URL}/reports/${report._id}">Click here</a></p>
    `;
    return this.sendEmail(worker.email, subject, html);
  }
}

module.exports = new NotificationService();