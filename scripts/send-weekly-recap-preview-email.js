const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: process.env.LINKUP_ENV_FILE || path.join(__dirname, '..', '.env') });

const to = process.argv[2] || 'yangd3542@gmail.com';
const previewPath = path.join(__dirname, '..', 'public', 'previews', 'weekly-recap-email-preview.html');
const html = fs.readFileSync(previewPath, 'utf8');

const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing SMTP config: ${missing.join(', ')}`);
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const text = [
  'Hi Daniel,',
  '',
  'Here is what happened with your rides and LinkUps this week.',
  '',
  'Rides taken: 3',
  'New LinkUps: 2',
  '',
  'Open LinkUp: https://linkuprides.com',
  '',
  'You are receiving this because weekly recap emails are turned on in your LinkUp notification settings.',
].join('\n');

transporter.sendMail({
  from: process.env.EMAIL_FROM || process.env.SMTP_USER,
  to,
  subject: 'Your LinkUp week',
  text,
  html,
}).then((info) => {
  console.log(`Weekly recap preview sent to ${to}: ${info.messageId}`);
}).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
