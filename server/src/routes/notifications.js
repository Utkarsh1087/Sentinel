const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

if (!resend) {
  console.warn('⚠️ RESEND_API_KEY is missing. Email notifications will be disabled.');
}

router.post('/join', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Send email to the admin (the user)
    if (resend) {
      await resend.emails.send({
        from: 'Sentinel Updates <onboarding@resend.dev>',
        to: '23257@iiitu.ac.in',
        subject: '🆕 New User Joined Update List',
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ff6044; border-radius: 10px; background-color: #050506; color: #efffeb;">
            <h2 style="color: #ff6044;">New Sentinel Subscriber</h2>
            <p>Great news! Someone just joined the update list from the landing page.</p>
            <p><strong>Subscriber Email:</strong> ${email}</p>
            <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
            <p style="color: #666; font-size: 12px;">Timestamp: ${new Date().toLocaleString()}</p>
          </div>
        `
      });
    }

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Failed to send join notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/pro-inquiry', async (req, res) => {
  const { email, useCase, referral, additionalInfo } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Send email to the admin
    if (resend) {
      await resend.emails.send({
        from: 'Sentinel Sales <onboarding@resend.dev>',
        to: '23257@iiitu.ac.in',
        subject: `💎 New Pro Application: ${email}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ff6044; border-radius: 15px; background-color: #050506; color: #efffeb;">
            <h2 style="color: #ff6044; border-bottom: 1px solid #333; padding-bottom: 10px;">Pro Plan Application</h2>
            <p>A user has requested an upgrade to the Pro plan ($12).</p>
            
            <div style="background: rgba(255,96,68,0.05); padding: 15px; border-radius: 10px; margin: 20px 0;">
              <p><strong>User Email:</strong> ${email}</p>
              <p><strong>Use Case:</strong> ${useCase}</p>
              <p><strong>Heard From:</strong> ${referral}</p>
              <p><strong>Additional Info:</strong> ${additionalInfo || 'N/A'}</p>
            </div>

            <p style="color: #ff6044; font-weight: bold;">Next Steps:</p>
            <ol>
              <li>Contact user at ${email} with payment details (PayPal/UPI/etc).</li>
              <li>Once payment is received, manually update their plan in the database.</li>
            </ol>
            
            <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
            <p style="color: #666; font-size: 12px;">Sentinel Automated Sales Protocol v1.0</p>
          </div>
        `
      });
    }

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Failed to send pro inquiry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
