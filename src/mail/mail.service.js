import nodemailer from 'nodemailer';
import { config } from '../config.js';

export class MailService {
  constructor() {

    this.transporter = nodemailer.createTransport({
      host: config.mail.smtp.host,
      port: config.mail.smtp.port,
      secure: config.mail.smtp.port === 465,
      auth: {
        user: config.mail.smtp.user,
        pass: config.mail.smtp.pass
      }
    });
  }

  async sendMail({ subject, html, to = [], priority = 'normal', attachments = [] }) {
    if (!config.mail.smtp.pass) {
      throw new Error('SMTP credentials missing: set SMTP_PASSWORD in config/env');
    }
    const mailOptions = {
      from: {
        name: config.mail.fromName,
        address: config.mail.from
      },
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      priority,
      attachments
    };

    return this.transporter.sendMail(mailOptions);
  }
}

export const mailService = new MailService();


