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
        <h1 style="font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 20px; letter-spacing: 2px;">ORDER RECEIVED</h1>
        <p style="color: #ccc; line-height: 1.6; margin-top: 30px;">Hello ${name},</p>
        <p style="color: #ccc; line-height: 1.6;">Thank you for your order. We have received your request for order <strong>#${orderId.slice(0, 8)}</strong> and it is currently pending review.</p>
        <div style="background: #111; border: 1px solid #333; padding: 20px; margin: 30px 0;">
          <p style="margin: 0 0 8px 0; font-weight: bold; letter-spacing: 1px;">ORDER TOTAL: €${total.toFixed(2)}</p>
          <p style="margin: 0; color: #aaa; font-size: 13px; letter-spacing: 0.5px;">Payment: Cash on Delivery</p>
        </div>
        <p style="color: #ccc; line-height: 1.6;">One of our team members will <strong>contact you by phone</strong> to confirm your order before it is dispatched. Please keep your phone available.</p>
        <p style="color: #666; font-size: 12px; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
          Questions? Contact us at support@triepe.com<br><br>
          TRIEPE OFFICIAL &copy; ${new Date().getFullYear()}<br>
          REDEFINING STREETWEAR
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"TRIEPE" <${SENDER_EMAIL}>`,
      to: email,
      subject: `Order Received - Triepe [#${orderId.slice(0, 8)}]`,
      html: htmlBody,
    });

    console.log(`[Email Service] Confirmation sent to ${email}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send email to ${email}:`, error);
  }
};

export const sendOrderConfirmedToCustomer = async (
  email: string,
  name: string,
  orderId: string,
) => {
  try {
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; text-transform: uppercase;">
        <h1 style="font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 20px; letter-spacing: 2px;">ORDER CONFIRMED</h1>
        <p style="color: #ccc; line-height: 1.6; margin-top: 30px;">Hello ${name},</p>
        <p style="color: #ccc; line-height: 1.6;">Good news — your Triepe order <strong>#${orderId.slice(0, 8)}</strong> has been confirmed and is now being prepared for dispatch.</p>
        <p style="color: #ccc; line-height: 1.6;">We'll send you another update as soon as your order ships.</p>
        <p style="color: #666; font-size: 12px; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
          Questions? Reply to this email or contact us at support@triepe.com<br><br>
          TRIEPE OFFICIAL &copy; ${new Date().getFullYear()}
        </p>
      </div>
    `;
    await transporter.sendMail({
      from: `"TRIEPE" <${SENDER_EMAIL}>`,
      to: email,
      subject: `[CONFIRMED] Your Triepe order #${orderId.slice(0, 8)}`,
      html: htmlBody,
    });
    console.log(`[Email Service] Confirmed email sent to ${email}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send confirmed email to ${email}:`, error);
  }
};

export const sendOrderShippedToCustomer = async (
  email: string,
  name: string,
  orderId: string,
  deliveryMethod: string,
) => {
  try {
    const courierName = deliveryMethod === 'IN_STORE' ? 'our store' : deliveryMethod.charAt(0) + deliveryMethod.slice(1).toLowerCase();
    const courierNote = deliveryMethod !== 'IN_STORE'
      ? `<p style="color: #ccc; line-height: 1.6;">The courier will reach out to you with delivery details. <strong>Tip:</strong> Both Speedy and Econt allow you to inspect your parcel at the office before accepting it — you can try it on and refuse if it doesn't work.</p>`
      : `<p style="color: #ccc; line-height: 1.6;">Your order is ready for pickup. We'll contact you with the pickup details.</p>`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; text-transform: uppercase;">
        <h1 style="font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 20px; letter-spacing: 2px;">ORDER SHIPPED</h1>
        <p style="color: #ccc; line-height: 1.6; margin-top: 30px;">Hello ${name},</p>
        <p style="color: #ccc; line-height: 1.6;">Your Triepe order <strong>#${orderId.slice(0, 8)}</strong> has been dispatched via <strong>${courierName}</strong>.</p>
        ${courierNote}
        <p style="color: #666; font-size: 12px; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
          Questions? Contact us at support@triepe.com<br><br>
          TRIEPE OFFICIAL &copy; ${new Date().getFullYear()}
        </p>
      </div>
    `;
    await transporter.sendMail({
      from: `"TRIEPE" <${SENDER_EMAIL}>`,
      to: email,
      subject: `[SHIPPED] Your Triepe order #${orderId.slice(0, 8)} is on its way`,
      html: htmlBody,
    });
    console.log(`[Email Service] Shipped email sent to ${email}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send shipped email to ${email}:`, error);
  }
};

export const sendOrderCompletedToCustomer = async (
  email: string,
  name: string,
  orderId: string,
) => {
  try {
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; text-transform: uppercase;">
        <h1 style="font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 20px; letter-spacing: 2px;">ORDER COMPLETE</h1>
        <p style="color: #ccc; line-height: 1.6; margin-top: 30px;">Hello ${name},</p>
        <p style="color: #ccc; line-height: 1.6;">Your Triepe order <strong>#${orderId.slice(0, 8)}</strong> has been marked as complete. We hope you love it.</p>
        <p style="color: #ccc; line-height: 1.6;">If there's any issue with your order, reach out to us at <strong>support@triepe.com</strong> and include your order number — we'll take a look.</p>
        <div style="background: #111; border: 1px solid #333; padding: 20px; margin: 30px 0; font-size: 12px; color: #aaa;">
          <p style="margin: 0 0 8px 0; font-weight: bold; letter-spacing: 1px;">RETURNS &amp; EXCHANGES</p>
          <p style="margin: 0; line-height: 1.6;">Returns are reviewed on a case-by-case basis. Contact support@triepe.com with your order number, reason, and photos if applicable.</p>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
          TRIEPE OFFICIAL &copy; ${new Date().getFullYear()}<br>
          REDEFINING STREETWEAR
        </p>
      </div>
    `;
    await transporter.sendMail({
      from: `"TRIEPE" <${SENDER_EMAIL}>`,
      to: email,
      subject: `[COMPLETED] Your Triepe order #${orderId.slice(0, 8)}`,
      html: htmlBody,
    });
    console.log(`[Email Service] Completed email sent to ${email}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send completed email to ${email}:`, error);
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
