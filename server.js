import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // Add this import

import sendMail from './sendMail.js'; // This will use nodemailer

const app = express();
app.use(cors());
app.use(express.json());

// Convert import.meta.url to __dirname equivalent in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/send-location', async (req, res) => {
  console.log("Mail Sent");
  const { contacts, location } = req.body;

  const subject = "Smart Wallet Lost - Last Location!";
  const message = `Last known location:\nLatitude: ${location.latitude}\n
  Longitude: ${location.longitude}\nYou can find the Disconnection Location through this link:
   https://www.google.com/maps?q=${location.latitude},${location.longitude}`;


  try {
    for (const contact of contacts) {
      await sendMail(contact, subject, message);
    }
    res.status(200).send('Emails sent successfully!');
  } catch (error) {
    console.error('Failed to send emails:', error);
    res.status(500).send('Error sending emails');
  }

});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
