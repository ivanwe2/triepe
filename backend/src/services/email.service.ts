import nodemailer from "nodemailer";
import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";

dotenv.config();

// Use SESClient explicitly (Standard for AWS SDK v3)
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "eu-central-1",
});

// Create transporter and pass the specific command nodemailer needs
const transporter = nodemailer.createTransport({
  SES: {
    ses: sesClient,
    aws: { SendRawEmailCommand },
  },
} as any); // Cast to any to prevent @types/nodemailer from throwing false errors

// Senders
const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@triepe.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@triepe.com";

/**
 * Dispatches an order confirmation email to the customer
 */
export const sendOrderConfirmationToCustomer = async (
  email: string,
  name: string,
  orderId: string,
  total: number,
) => {
  try {
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; text-transform: uppercase;">
        <h1 style="font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 20px; letter-spacing: 2px;">ORDER CONFIRMED</h1>
        <p style="color: #ccc; line-height: 1.6; margin-top: 30px;">Hello ${name},</p>
        <p style="color: #ccc; line-height: 1.6;">Thank you for securing your piece from Triepe. Your order <strong>#${orderId.slice(0, 8)}</strong> has been received and is currently being processed.</p>
        <div style="background: #111; border: 1px solid #333; padding: 20px; margin: 30px 0;">
          <p style="margin: 0; font-weight: bold; letter-spacing: 1px;">TOTAL: €${total.toFixed(2)}</p>
        </div>
        <p style="color: #ccc; font-size: 12px; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
          TRIEPE OFFICIAL &copy; ${new Date().getFullYear()}<br>
          REDEFINING STREETWEAR
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"TRIEPE" <${SENDER_EMAIL}>`,
      to: email,
      subject: `Order Confirmation - Triepe [#${orderId.slice(0, 8)}]`,
      html: htmlBody,
    });

    console.log(`[Email Service] Confirmation sent to ${email}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send email to ${email}:`, error);
  }
};

/**
 * Dispatches a minimal alert to the Admin
 */
export const sendNewOrderAlertToAdmin = async (
  orderId: string,
  method: string,
) => {
  try {
    if (!process.env.ADMIN_EMAIL) return;

    // Extremely simple text-based email for the admin to prevent clutter
    const textBody = `NEW ORDER RECEIVED.\nID: ${orderId}\nMethod: ${method}\n\nView Dashboard: https://triepe.com/admin/orders/${orderId}`;

    await transporter.sendMail({
      from: `"TRIEPE SYSTEM" <${SENDER_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `[NEW ORDER] #${orderId.slice(0, 8)}`,
      text: textBody,
    });
  } catch (error) {
    console.error(`[Email Service] Failed to send admin notification:`, error);
  }
};
