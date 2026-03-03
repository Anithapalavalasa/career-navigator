import crypto from "crypto";
import nodemailer from "nodemailer";

// Email configuration - using provided SMTP details
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "support@jntugv.edu.in",
    pass: "eimf lirz gjem swxj",
  },
});

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  username: string,
  resetToken: string,
  baseUrl: string
): Promise<boolean> {
  const resetUrl = `${baseUrl}/admin/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"Tech Support JNTU-GV" <support@jntugv.edu.in>`,
    to,
    subject: "Password Reset Request - JNTU-GV Careers Portal",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">JNTU-GV Careers Portal</h1>
                    <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 14px;">Administrative Portal</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Password Reset Request</h2>
                    
                    <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
                      Hello <strong>${username}</strong>,
                    </p>
                    
                    <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
                      We received a request to reset your password for the JNTU-GV Careers Portal. 
                      Click the button below to create a new password:
                    </p>
                    
                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #6b7280; margin: 20px 0 0 0; font-size: 12px; line-height: 1.6;">
                      This link will expire in <strong>15 minutes</strong> for security purposes.
                    </p>
                    
                    <p style="color: #6b7280; margin: 20px 0 0 0; font-size: 12px; line-height: 1.6;">
                      If you didn't request this password reset, please ignore this email or contact the administrator if you have concerns.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 20px 30px; border-radius: 0 0 8px 8px; text-align: center;">
                    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                      This is an automated message from JNTU-GV Careers Portal. Please do not reply to this email.
                    </p>
                    <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 11px;">
                      &copy; ${new Date().getFullYear()} JNTU-GV. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `Hello ${username},\n\nWe received a request to reset your password for the JNTU-GV Careers Portal.\n\nClick the link below to reset your password:\n${resetUrl}\n\nThis link will expire in 15 minutes.\n\nIf you didn't request this, please ignore this email.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send password reset email:`, error);
    return false;
  }
}

/**
 * Send password changed confirmation email
 */
export async function sendPasswordChangedEmail(
  to: string,
  username: string
): Promise<boolean> {
  const mailOptions = {
    from: `"Tech Support JNTU-GV" <support@jntugv.edu.in>`,
    to,
    subject: "Password Changed Successfully - JNTU-GV Careers Portal",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">JNTU-GV Careers Portal</h1>
                    <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 14px;">Administrative Portal</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                      <div style="width: 60px; height: 60px; background-color: #d1fae5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                        <span style="font-size: 30px;">✓</span>
                      </div>
                    </div>
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; text-align: center;">Password Changed Successfully</h2>
                    <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; text-align: center;">
                      Hello <strong>${username}</strong>,
                    </p>
                    <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; text-align: center;">
                      Your password has been changed successfully. You can now log in with your new password.
                    </p>
                    <p style="color: #6b7280; margin: 0; font-size: 12px; line-height: 1.6; text-align: center;">
                      If you didn't make this change, please contact the administrator immediately.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f9fafb; padding: 20px 30px; border-radius: 0 0 8px 8px; text-align: center;">
                    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                      This is an automated message from JNTU-GV Careers Portal.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `Hello ${username},\n\nYour password has been changed successfully.\n\nIf you didn't make this change, please contact the administrator immediately.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password changed confirmation email sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`Failed to send confirmation email:`, error);
    return false;
  }
}

/**
 * Generate a secure random token (for fallback/testing)
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
