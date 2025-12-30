import { Resend } from "resend";
import { ENV } from "./_core/env";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(ENV.resendApiKey);
  }
  return resendClient;
}

export interface ReportData {
  email: string;
  name?: string;
  score: number;
  maxScore: number;
  fitType: string;
  message: string;
  cta: string;
}

/**
 * Send Smart Fit Snapshot report via email
 */
export async function sendReportEmail(data: ReportData): Promise<boolean> {
  if (!ENV.resendApiKey) {
    console.warn("[Email] Resend API key not configured. Email not sent.");
    return false;
  }

  try {
    const htmlContent = generateReportHTML(data);

    const response = await getResendClient().emails.send({
      from: "The Founder Link <noreply@thefounderlink.com>",
      to: data.email,
      subject: `Your Smart Fit Snapshot: ${data.fitType} Match`,
      html: htmlContent,
    });

    if (response.error) {
      console.error("[Email] Failed to send report:", response.error);
      return false;
    }

    console.log("[Email] Report sent successfully to", data.email);
    return true;
  } catch (error) {
    console.error("[Email] Error sending report:", error);
    return false;
  }
}

/**
 * Generate HTML email content for the report
 */
function generateReportHTML(data: ReportData): string {
  const scorePercentage = Math.round((data.score / data.maxScore) * 100);
  const bgColor =
    data.fitType === "PERFECT NOCODE"
      ? "#EC4899"
      : data.fitType === "VIABLE"
        ? "#F59E0B"
        : "#6B7280";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0D1B2A 0%, #1a2a3a 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f9fafb; padding: 40px 20px; border-radius: 0 0 8px 8px; }
    .score-box { background: white; border: 2px solid ${bgColor}; border-radius: 8px; padding: 30px; text-align: center; margin: 20px 0; }
    .score-title { font-size: 18px; font-weight: 600; color: ${bgColor}; text-transform: uppercase; letter-spacing: 1px; }
    .score-value { font-size: 48px; font-weight: bold; color: ${bgColor}; margin: 10px 0; }
    .score-bar { background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden; margin: 20px 0; }
    .score-fill { background: ${bgColor}; height: 100%; width: ${scorePercentage}%; }
    .message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${bgColor}; }
    .cta-button { display: inline-block; background: ${bgColor}; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Smart Fit Snapshot</h1>
      <p>Assessment Results</p>
    </div>
    
    <div class="content">
      <div class="score-box">
        <div class="score-title">${data.fitType}</div>
        <div class="score-value">${data.score}/${data.maxScore}</div>
        <div class="score-bar">
          <div class="score-fill"></div>
        </div>
        <p style="color: #6b7280; margin: 10px 0 0 0;">Your project fit score</p>
      </div>

      <div class="message">
        <p>${data.message}</p>
      </div>

      <div style="text-align: center;">
        <a href="https://thefounderlink.com" class="cta-button">${data.cta}</a>
      </div>

      <div class="footer">
        <p>The Founder Link • Hire the right developers in 7 days</p>
        <p>© 2025 The Founder Link. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}


export interface ConfirmationEmailData {
  email: string;
  name: string;
  company: string;
  productType: "nocode-matches" | "fullstack-waitlist" | "mobile-waitlist";
}

/**
 * Send confirmation email after successful payment
 */
export async function sendConfirmationEmail(data: ConfirmationEmailData): Promise<boolean> {
  if (!ENV.resendApiKey) {
    console.warn("[Email] Resend API key not configured. Confirmation email not sent.");
    return false;
  }

  try {
    const productName =
      data.productType === "nocode-matches"
        ? "3 Vetted No-Code Developer Matches"
        : data.productType === "fullstack-waitlist"
        ? "Full-Stack Developer Priority Waitlist"
        : "Mobile Developer Priority Waitlist";

    const htmlContent = generateConfirmationHTML({
      name: data.name,
      company: data.company,
      productName,
    });

    const response = await getResendClient().emails.send({
      from: "The Founder Link <noreply@thefounderlink.com>",
      to: data.email,
      subject: `Welcome to The Founder Link - ${productName}`,
      html: htmlContent,
    });

    if (response.error) {
      console.error("[Email] Failed to send confirmation:", response.error);
      return false;
    }

    console.log("[Email] Confirmation sent successfully to", data.email);
    return true;
  } catch (error) {
    console.error("[Email] Error sending confirmation:", error);
    return false;
  }
}

/**
 * Generate HTML email content for confirmation
 */
function generateConfirmationHTML(data: {
  name: string;
  company: string;
  productName: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; border-radius: 8px; margin-top: 20px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          .cta { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to The Founder Link!</h1>
            <p>Your payment has been received</p>
          </div>
          
          <div class="content">
            <p>Hi ${data.name},</p>
            
            <p>Thank you for your purchase! We're excited to help you find the right developers for ${data.company}.</p>
            
            <p><strong>What you're getting:</strong></p>
            <p>${data.productName}</p>
            
            <p><strong>Next steps:</strong></p>
            <ol>
              <li>Our team will review your intake information</li>
              <li>We'll curate the best matches for your specific needs</li>
              <li>You'll receive a calendar invite for your Match Review call (within 24 hours)</li>
            </ol>
            
            <p>If you have any questions in the meantime, feel free to reach out to us at <strong>hello@thefounderlink.com</strong></p>
            
            <p>Best regards,<br>The Founder Link Team</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 The Founder Link. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}


export interface MatchNotificationData {
  customerEmail: string;
  customerName: string;
  developerName: string;
  developerTitle: string;
  developerBio?: string;
  portfolioUrl?: string;
  matchReason?: string;
}

/**
 * Send match notification email to customer with developer details
 */
export async function sendMatchNotificationEmail(data: MatchNotificationData): Promise<boolean> {
  if (!ENV.resendApiKey) {
    console.warn("[Email] Resend API key not configured. Match notification not sent.");
    return false;
  }

  try {
    const htmlContent = generateMatchNotificationHTML(data);

    const response = await getResendClient().emails.send({
      from: "The Founder Link <noreply@thefounderlink.com>",
      to: data.customerEmail,
      subject: `Your Developer Match: ${data.developerName}`,
      html: htmlContent,
    });

    if (response.error) {
      console.error("[Email] Failed to send match notification:", response.error);
      return false;
    }

    console.log("[Email] Match notification sent to", data.customerEmail);
    return true;
  } catch (error) {
    console.error("[Email] Error sending match notification:", error);
    return false;
  }
}

/**
 * Generate HTML email content for match notification
 */
function generateMatchNotificationHTML(data: MatchNotificationData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
          .developer-card { background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .developer-name { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 5px; }
          .developer-title { color: #2563eb; font-weight: 600; margin-bottom: 10px; }
          .developer-bio { color: #4b5563; line-height: 1.6; margin-bottom: 15px; }
          .match-reason { background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .cta-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 15px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Developer Match is Ready!</h1>
            <p>We found a great fit for your project</p>
          </div>
          
          <p>Hi ${data.customerName},</p>
          
          <p>Great news! We've identified a developer that we think is a perfect fit for your project.</p>
          
          <div class="developer-card">
            <div class="developer-name">${data.developerName}</div>
            <div class="developer-title">${data.developerTitle}</div>
            
            ${data.developerBio ? `<div class="developer-bio">${data.developerBio}</div>` : ""}
            
            ${
              data.matchReason
                ? `<div class="match-reason"><strong>Why we matched you:</strong><br>${data.matchReason}</div>`
                : ""
            }
            
            ${
              data.portfolioUrl
                ? `<a href="${data.portfolioUrl}" class="cta-button">View Portfolio</a>`
                : ""
            }
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ol>
            <li>Review the developer's profile and portfolio</li>
            <li>If interested, we'll facilitate an introduction</li>
            <li>Schedule a call to discuss your project details</li>
            <li>Finalize terms and get started!</li>
          </ol>
          
          <p>If you have any questions or would like to discuss this match, feel free to reach out to us at <strong>hello@thefounderlink.com</strong></p>
          
          <p>Best regards,<br>The Founder Link Team</p>
          
          <div class="footer">
            <p>&copy; 2024 The Founder Link. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}


export interface PaymentConfirmationData {
  customerEmail: string;
  customerName: string;
  productType: "nocode-matches" | "fullstack-waitlist" | "mobile-waitlist";
  amount: number;
}

/**
 * Send payment confirmation email to customer with next steps
 */
export async function sendPaymentConfirmationEmail(data: PaymentConfirmationData): Promise<boolean> {
  if (!ENV.resendApiKey) {
    console.warn("[Email] Resend API key not configured. Payment confirmation not sent.");
    return false;
  }

  try {
    const htmlContent = generatePaymentConfirmationHTML(data);

    const response = await getResendClient().emails.send({
      from: "The Founder Link <noreply@thefounderlink.com>",
      to: data.customerEmail,
      subject: "Payment Confirmed - Next Steps to Get Your Matches",
      html: htmlContent,
    });

    if (response.error) {
      console.error("[Email] Failed to send payment confirmation:", response.error);
      return false;
    }

    console.log("[Email] Payment confirmation sent to", data.customerEmail);
    return true;
  } catch (error) {
    console.error("[Email] Error sending payment confirmation:", error);
    return false;
  }
}

/**
 * Generate HTML email content for payment confirmation with next steps
 */
function generatePaymentConfirmationHTML(data: PaymentConfirmationData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .next-steps { background: #f0f9ff; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .next-steps h3 { margin-top: 0; color: #1e40af; font-size: 18px; }
          .next-steps ol { margin: 15px 0; padding-left: 20px; }
          .next-steps li { margin: 12px 0; color: #1e3a8a; line-height: 1.6; }
          .step-title { font-weight: 600; color: #1f2937; }
          .cta-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 15px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          .support-link { color: #2563eb; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Payment Confirmed!</h1>
            <p>Your journey to finding the perfect developer starts now</p>
          </div>
          
          <p>Hi ${data.customerName},</p>
          
          <p>Thank you for your payment! We're thrilled to have you on board. Here's what happens next:</p>
          
          <div class="next-steps">
            <h3>Your Next Steps</h3>
            <ol>
              <li>
                <span class="step-title">Schedule Your Online Call</span><br>
                If you haven't already, schedule a 30-minute call with our team to dive deeper into your project needs, timeline, and budget. This ensures we find the best possible matches for you.<br>
                <a href="${ENV.calendlyUrl}" class="cta-button">Book Your Call Now</a>
              </li>
              <li>
                <span class="step-title">Review the 7-Day Sprint Material</span><br>
                We'll send you our comprehensive 7-Day Smart Selection Sprint guide. This includes templates, interview scripts, and evaluation criteria to help you make confident hiring decisions.
              </li>
              <li>
                <span class="step-title">Join Our Newsletter</span><br>
                Stay updated with hiring tips, industry insights, and success stories from other founders. We share practical advice to help you build your ideal team.
              </li>
              <li>
                <span class="step-title">Receive Your Developer Matches</span><br>
                Within 24 hours, you'll receive 3 carefully vetted developer profiles matched to your specific needs. Each profile includes their portfolio, experience, and why we think they're a great fit.
              </li>
            </ol>
          </div>
          
          <p><strong>Ready to get started?</strong> <a href="${ENV.calendlyUrl}">Book your call now</a> or reply to this email if you have any questions.</p>
          
          <p>Best regards,<br><strong>The Founder Link Team</strong><br>
          <a href="mailto:hello@thefounderlink.com" class="support-link">hello@thefounderlink.com</a></p>
          
          <div class="footer">
            <p>&copy; 2024 The Founder Link. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
