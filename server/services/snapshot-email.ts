import { Resend } from "resend";
import { ENV } from "../_core/env";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(ENV.resendApiKey);
  }
  return resendClient;
}

export interface SnapshotEmailData {
  email: string;
  name: string;
  route: string;
  clarityBrief: string;
  recommendations: {
    stack: string;
    devType: string;
    reasoning: string;
  };
}

/**
 * Send free Smart Fit Snapshot email with preview documents
 */
export async function sendSnapshotEmail(data: SnapshotEmailData): Promise<boolean> {
  if (!ENV.resendApiKey) {
    console.warn("[Email] Resend API key not configured. Snapshot email not sent.");
    return false;
  }

  try {
    const htmlContent = generateSnapshotHTML(data);

    // Convert markdown to plain text for email attachment
    const clarityAttachment = Buffer.from(data.clarityBrief, "utf-8").toString("base64");

    const response = await getResendClient().emails.send({
      from: "The Founder Link <noreply@thefounderlink.com>",
      to: data.email,
      subject: `Your Smart Fit Snapshot is Ready! 📋`,
      html: htmlContent,
      attachments: [
        {
          filename: "Project-Clarity-Brief.md",
          content: clarityAttachment,
        },
      ],
    });

    if (response.error) {
      console.error("[Email] Failed to send snapshot:", response.error);
      return false;
    }

    console.log("[Email] Snapshot sent successfully to", data.email);
    return true;
  } catch (error) {
    console.error("[Email] Error sending snapshot:", error);
    return false;
  }
}

/**
 * Generate HTML email content for free snapshot
 */
function generateSnapshotHTML(data: SnapshotEmailData): string {
  const routeColor = data.route === 'nocode' ? '#F59E0B' : data.route === 'hybrid' ? '#10B981' : '#3B82F6';
  const routeLabel = data.route === 'nocode' ? 'No-Code' : data.route === 'hybrid' ? 'Hybrid' : 'Custom Development';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: #1F2937; 
      background-color: #F3F2EE;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
    }
    .header { 
      background: #1F2937;
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0 0 10px 0; 
      font-size: 28px; 
      font-weight: 700;
    }
    .header p {
      margin: 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content { 
      padding: 40px 30px; 
    }
    .route-badge {
      display: inline-block;
      background: ${routeColor};
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .recommendation-box {
      background: #F9FAFB;
      border-left: 4px solid ${routeColor};
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .recommendation-box h3 {
      margin: 0 0 10px 0;
      color: #1F2937;
      font-size: 18px;
    }
    .recommendation-box p {
      margin: 5px 0;
      color: #4B5563;
    }
    .cta-button { 
      display: inline-block; 
      background: ${routeColor}; 
      color: white; 
      padding: 14px 32px; 
      text-decoration: none; 
      border-radius: 6px; 
      font-weight: 600; 
      margin: 20px 0;
      text-align: center;
    }
    .cta-button:hover {
      opacity: 0.9;
    }
    .divider {
      border: none;
      border-top: 1px solid #E5E7EB;
      margin: 30px 0;
    }
    .footer { 
      text-align: center; 
      color: #6B7280; 
      font-size: 13px; 
      padding: 30px;
      background: #F9FAFB;
    }
    .footer p {
      margin: 5px 0;
    }
    .attachments {
      background: #FEF3C7;
      border: 1px solid #FCD34D;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .attachments strong {
      color: #92400E;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Smart Fit Snapshot is Ready!</h1>
      <p>Here's what we learned about your project</p>
    </div>
    
    <div class="content">
      <p>Hi ${data.name},</p>
      
      <p>Thanks for completing the assessment! Based on your responses, here's your personalized Smart Fit Snapshot:</p>

      <div style="text-align: center; margin: 20px 0;">
        <span class="route-badge">${routeLabel} Path</span>
      </div>

      <div class="recommendation-box">
        <h3>🛠 Recommended Tech Stack</h3>
        <p><strong>${data.recommendations.stack}</strong></p>
        <p style="margin-top: 10px; font-size: 14px;">${data.recommendations.reasoning}</p>
      </div>

      <div class="recommendation-box">
        <h3>👨‍💻 Developer Type You Need</h3>
        <p><strong>${data.recommendations.devType}</strong></p>
      </div>

      <div class="attachments">
        <strong>📎 Attached Documents:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Project-Clarity-Brief.md (Document 1)</li>
        </ul>
        <p style="margin: 5px 0; font-size: 13px; color: #92400E;">This is your Project Clarity Brief - generated from your answers.</p>
      </div>

      <hr class="divider">

      <h3 style="color: #1F2937; margin-bottom: 15px;">Want the Full Hiring Blueprint?</h3>
      
      <p>Upgrade to get:</p>
      <ul style="color: #4B5563;">
        <li><strong>All 4 Documents</strong> (Clarity Brief, Hiring Playbook, PRD, Working Agreement)</li>
        <li><strong>Downloadable files</strong> (Word or Markdown)</li>
        <li><strong>Working Agreement template</strong> you can edit and review with legal</li>
        <li><strong>Hiring Playbook</strong> with vetting + interview questions + test task</li>
      </ul>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://thefounderlink.com/results" class="cta-button">
          Upgrade to Full Blueprint - $149
        </a>
      </div>

      <p style="color: #6B7280; font-size: 14px; text-align: center;">
        One-time payment • Instant delivery • 7-day money-back guarantee
      </p>

      <hr class="divider">

      <p>Questions? Reply to this email or reach out at <strong>hello@thefounderlink.com</strong></p>
      
      <p style="margin-top: 30px;">Best regards,<br><strong>The Founder Link Team</strong></p>
    </div>
    
    <div class="footer">
      <p><strong>The Founder Link</strong></p>
      <p>Helping non-technical founders hire the right developers</p>
      <p style="margin-top: 15px;">&copy; 2025 The Founder Link. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}
