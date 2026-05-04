require('dotenv').config();
const { Resend } = require('resend');

async function testMail() {
  const apiKey = process.env.RESEND_API_KEY;
  const testEmail = '23257@iiitu.ac.in'; // Updated to your verified Resend email


  if (!apiKey || apiKey.includes('your_api_key')) {
    console.error('❌ Error: RESEND_API_KEY is not set correctly in .env');
    return;
  }

  const resend = new Resend(apiKey);

  console.log(`📡 Sending test alert email to ${testEmail}...`);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Sentinel <onboarding@resend.dev>',
      to: testEmail,
      subject: '🧪 Sentinel Mail Test',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ff6044; border-radius: 10px; background-color: #050506; color: #efffeb;">
          <h2 style="color: #ff6044;">Connection Successful</h2>
          <p>This is a test email from your <strong>Sentinel</strong> observability platform.</p>
          <p>If you are reading this, your Resend integration is <strong>working perfectly</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">Timestamp: ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Resend Error:', error.message);
    } else {
      console.log('✅ Success! Check your inbox (and spam folder).');
      console.log('Message ID:', data.id);
    }
  } catch (err) {
    console.error('💥 Unexpected Error:', err.message);
  }
}

testMail();
