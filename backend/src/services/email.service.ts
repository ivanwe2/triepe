import nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import dotenv from 'dotenv';

dotenv.config();

// Securely initialize AWS SES Client
const ses = new aws.SES({
  apiVersion: '2010-12-01',
  region: process.env.AWS_REGION || 'eu-central-1', // Default to your chosen EU region if not set
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Create Nodemailer transporter wrapped with SES
const transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

const SENDER_EMAIL = process.env.ADMIN_EMAIL || 'support@triepe.com';

/**
 * Dispatches an order confirmation email to the customer
 */
export const sendOrderConfirmationToCustomer = async (email: string, name: string, orderId: string, total: number) => {
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

    console.log(`[Email Service] Confirmation sent successfully to ${email}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send email to ${email}:`, error);
  }
};

/**
 * Dispatches an alert to the Admin securely
 */
export const sendNewOrderAlertToAdmin = async (orderId: string, method: string) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('[Email Service] ADMIN_EMAIL not set. Skipping admin notification.');
      return;
    }

    const adminUrl = `https://triepe.com/admin/orders/${orderId}`;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f4f5; color: #000; padding: 40px;">
        <h1 style="font-size: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 30px;">Alert: New Order Received</h1>
        <p>A new order has been placed on Triepe via <strong>${method}</strong>.</p>
        <p>Order ID: <strong>${orderId}</strong></p>
        <a href="${adminUrl}" style="display: inline-block; background: #000; color: #fff; padding: 15px 30px; text-decoration: none; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; margin-top: 20px;">
          View in Dashboard
        </a>
      </div>
    `;

    await transporter.sendMail({
      from: `"TRIEPE SYSTEM" <${SENDER_EMAIL}>`,
      to: adminEmail,
      subject: `[ACTION REQUIRED] New Order Received #${orderId.slice(0, 8)}`,
      html: htmlBody,
    });

    console.log(`[Email Service] Admin notification sent successfully.`);
  } catch (error) {
    console.error(`[Email Service] Failed to send admin notification:`, error);
  }
};