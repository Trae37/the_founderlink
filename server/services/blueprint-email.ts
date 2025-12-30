import { Resend } from "resend";
import { ENV } from "../_core/env";
import fs from "fs/promises";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(ENV.resendApiKey);
  }
  return resendClient;
}

export interface BlueprintEmailData {
  email: string;
  name: string;
  route: string;
  format: "docx" | "md";
  files: {
    clarityBrief: string;
    hiringPlaybook: string;
    prd: string;
    workingAgreement: string;
  };
  recommendations: {
    stack: string;
    devType: string;
    reasoning: string;
  };
  calendlyUrl?: string;
}

/**
 * Send paid Blueprint email with full enhanced documents
 */
export async function sendBlueprintEmail(data: BlueprintEmailData): Promise<boolean> {
  if (!ENV.resendApiKey) {
    console.warn("[Email] Resend API key not configured. Blueprint email not sent.");
    return false;
  }

  try {
    const htmlContent = generateBlueprintHTML(data);

    // Read all document files and convert to base64
    const attachments = [];

    try {
      const ext = data.format === "docx" ? "docx" : "md";
      const [clarityBuffer, hiringBuffer, prdBuffer, agreementBuffer] = await Promise.all([
        fs.readFile(data.files.clarityBrief),
        fs.readFile(data.files.hiringPlaybook),
        fs.readFile(data.files.prd),
        fs.readFile(data.files.workingAgreement),
      ]);

      attachments.push(
        {
          filename: `Project-Clarity-Brief.${ext}`,
          content: clarityBuffer.toString("base64"),
        },
        {
          filename: `Hiring-Playbook.${ext}`,
          content: hiringBuffer.toString("base64"),
        },
        {
          filename: `PRD.${ext}`,
          content: prdBuffer.toString("base64"),
        },
        {
          filename: `Working-Agreement.${ext}`,
          content: agreementBuffer.toString("base64"),
        }
      );
    } catch (fileError) {
      console.error("[Email] Error reading document files:", fileError);
      // Continue without attachments if files can't be read
    }

    const response = await getResendClient().emails.send({
      from: "The Founder Link <noreply@thefounderlink.com>",
      to: data.email,
      subject: `Your Full Hiring Blueprint is Ready! 🎯`,
      html: htmlContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (response.error) {
      console.error("[Email] Failed to send Blueprint:", response.error);
      return false;
    }

    console.log("[Email] Blueprint sent successfully to", data.email);
    return true;
  } catch (error) {
    console.error("[Email] Error sending Blueprint:", error);
    return false;
  }
}

/**
 * Generate HTML email content for paid Blueprint
 */
function generateBlueprintHTML(data: BlueprintEmailData): string {
  const routeColor = data.route === 'nocode' ? '#F59E0B' : data.route === 'hybrid' ? '#10B981' : '#3B82F6';
  const routeLabel = data.route === 'nocode' ? 'No-Code' : data.route === 'hybrid' ? 'Hybrid' : 'Custom Development';
  const calendlyUrl = data.calendlyUrl || 'https://calendly.com/thefounderlink';
  const formatLabel = data.format === "docx" ? "Word (.docx)" : "Markdown (.md)";

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
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
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
      opacity: 0.95;
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
    .highlight-box {
      background: #FEF3C7;
      border: 2px solid #F59E0B;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      text-align: center;
    }
    .highlight-box h3 {
      margin: 0 0 10px 0;
      color: #92400E;
      font-size: 20px;
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
      background: #F59E0B; 
      color: white; 
      padding: 16px 36px; 
      text-decoration: none; 
      border-radius: 6px; 
      font-weight: 700; 
      margin: 20px 0;
      text-align: center;
      font-size: 16px;
    }
    .cta-button:hover {
      background: #D97706;
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
      background: #ECFDF5;
      border: 1px solid #10B981;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .attachments strong {
      color: #065F46;
    }
    .attachments ul {
      margin: 10px 0;
      padding-left: 20px;
      color: #047857;
    }
    .next-steps {
      background: #F9FAFB;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .next-steps h3 {
      margin: 0 0 15px 0;
      color: #1F2937;
    }
    .next-steps ol {
      margin: 0;
      padding-left: 20px;
      color: #4B5563;
    }
    .next-steps li {
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Your Full Hiring Blueprint is Ready!</h1>
      <p>enhanced documents attached</p>
    </div>
    
    <div class="content">
      <p>Hi ${data.name},</p>
      
      <p>Congratulations! Your complete, enhanced Hiring Blueprint has been generated and is attached to this email.</p>

      <div class="highlight-box">
        <h3>✅ You're All Set!</h3>
        <p style="margin: 0; color: #92400E;">Your documents are attached below in ${formatLabel} format</p>
      </div>

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
        <strong>📎 Your Complete Hiring Blueprint (4 files):</strong>
        <ul>
          <li><strong>Project Clarity Brief</strong> (${formatLabel})</li>
          <li><strong>Hiring Playbook</strong> (${formatLabel})</li>
          <li><strong>PRD</strong> (${formatLabel})</li>
          <li><strong>Working Agreement</strong> (${formatLabel})</li>
        </ul>
      </div>

      <div class="next-steps">
        <h3>📋 Next Steps:</h3>
        <ol>
          <li><strong>Download your documents</strong> - All files are attached to this email</li>
          <li><strong>Review your PRD</strong> - Make any adjustments for your specific needs</li>
          <li><strong>Book your 1-on-1 review call</strong> - Let's discuss your hiring strategy (link below)</li>
          <li><strong>Start hiring</strong> - Use the playbook to post, vet, and hire confidently</li>
        </ol>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${calendlyUrl}" class="cta-button">
          📅 Book Your Review Call (Free)
        </a>
      </div>

      <p style="color: #6B7280; font-size: 14px; text-align: center; margin-top: 10px;">
        30-minute call to review your documents and answer questions
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
