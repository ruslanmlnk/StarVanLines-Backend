import { Router } from 'express';
import { mailService } from '../mail/mail.service.js';
import { config } from '../config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/send', async (req, res) => {
  try {
    const { EmailAddress } = req.body || {};
    const attachments = [
      {
        filename: 'Checklist.pdf',
        path: config.checklistPdfPath
      }
    ];

    await mailService.sendMail({
      subject: 'Your Checklist: 10 steps to Perfect Packing',
      to: [EmailAddress],
      attachments
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;


