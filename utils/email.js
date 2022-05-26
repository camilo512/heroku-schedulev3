const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

dotenv.config({ path: './config.env' });
class Email {
  constructor(to) {
    this.to = to;
  }

  // Create a connection with an email service
  newTransport() {
    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  //Send the actual email
  async send(template, subject, emailData) {
    //Get the pug file that needs to send
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      emailData
    );

    await this.newTransport().sendMail({
      from: 'support-repairAPP@gmail.com',
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    });
  }

  //send an email to newly create account
  async sendWelcome() {
    await this.send('welcome', 'New account', { name: 'Juan' });
  }

  // Send an email when a new repair is create
  async sendCreateReapir() {
    await this.send('repair', '', {});
  }
}

module.exports = { Email };
