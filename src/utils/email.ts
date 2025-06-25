import { Resend } from 'resend';

export async function sendWaitlistConfirmationEmail(email: string) {
  // Initialize Resend only when needed and handle missing API key
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('RESEND_API_KEY environment variable is not set. Email will not be sent.');
    return { error: 'Email service not configured' };
  }

  const resend = new Resend(apiKey);

  return resend.emails.send({
    from: 'FeedVote <no-reply@feedvote.com>',
    to: email,
    subject: "You're on the FeedVote Waitlist! 🎉",
    html: `
<div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f7fafc; border-radius: 16px; box-shadow: 0 2px 8px #0001; padding: 32px 24px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h2 style="color: #22d3ee; font-size: 1.7rem; margin: 0 0 8px 0; letter-spacing: -1px;">Welcome to <span style='color: #22c55e;'>FeedVote</span> <span style="font-size: 1.2em;">👋</span></h2>
    <div style="font-size: 1.1rem; color: #16a34a; font-weight: 600; margin-bottom: 8px;">You're on the waitlist! 🎉</div>
  </div>
  <p style="color: #222; font-size: 1.08rem; margin-bottom: 18px;">Thanks for joining our early access waitlist!<br>We'll keep you posted about our launch and exclusive early adopter benefits.</p>
  <ul style="color: #15803d; font-size: 1rem; margin-bottom: 20px; padding-left: 1.2em;">
    <li style="margin-bottom: 6px;">Priority access to beta features</li>
    <li style="margin-bottom: 6px;">Direct feedback channel with our team</li>
    <li style="margin-bottom: 6px;">Exclusive webinars and tutorials</li>
    <li style="margin-bottom: 6px;">Special <b>"Early Bird"</b> badge and pricing</li>
  </ul>
  <p style="color: #222; font-size: 1.05rem; margin-bottom: 24px;">In the meantime, follow us on <a href="https://x.com/AjaxTheMaker" style="color: #22c55e; text-decoration: underline; font-weight: 500;">X</a> or reply to this email with your feedback!</p>
  <div style="margin-top: 32px; text-align: center; color: #16a34a; font-size: 1.1rem; font-weight: 600;">— The FeedVote Team</div>
</div>
    `,
  });
}
