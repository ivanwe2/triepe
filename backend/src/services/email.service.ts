/**
 * Mock Email Service
 * In the future, install `resend` or `nodemailer` and replace the console.logs!
 */

export const sendOrderConfirmationToCustomer = async (email: string, name: string, orderId: string, total: number) => {
  console.log(`\n=========================================`);
  console.log(`📧 SENDING EMAIL TO CUSTOMER: ${email}`);
  console.log(`Subject: Order Confirmation - Triepe [${orderId}]`);
  console.log(`Body: Hello ${name}, thank you for your order. Your total is ${total} BGN/USD. We are processing it now.`);
  console.log(`=========================================\n`);
  
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
};

export const sendNewOrderAlertToAdmin = async (orderId: string, method: string) => {
  console.log(`\n=========================================`);
  console.log(`🚨 SENDING EMAIL TO ADMIN`);
  console.log(`Subject: NEW ORDER RECEIVED [${orderId}]`);
  console.log(`Body: A new order was just placed via ${method}. Check the admin dashboard.`);
  console.log(`=========================================\n`);
};