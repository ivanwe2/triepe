import { prisma } from '../config';
import { DeliveryMethod, PaymentMethod } from '@prisma/client';
import { sendOrderConfirmationToCustomer, sendNewOrderAlertToAdmin } from './email.service';

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  city?: string;
  addressOrOffice?: string;
  notes?: string;
  items: { productId: string; quantity: number; size: string }[];
}

export const createOrder = async (data: CreateOrderPayload) => {
  // 1. Fetch products securely from DB to calculate the real total
  const productIds = data.items.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });

  if (products.length !== productIds.length) {
    throw new Error("One or more products in your cart are invalid or sold out.");
  }

  // 2. Calculate the total (subtotal + shipping)
  let subtotal = 0;
  const orderItemsData = data.items.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId)!;
    subtotal += product.price * cartItem.quantity;
    
    return {
      productId: product.id,
      quantity: cartItem.quantity,
      size: cartItem.size,
      priceAtBuy: product.price
    };
  });

  // Calculate mock shipping cost (Free for IN_STORE, $6.50 for courier)
  const shippingCost = data.deliveryMethod === 'IN_STORE' ? 0 : 6.50;
  const totalAmount = subtotal + shippingCost;

  // 3. Save the Order & Items to Database (Transaction)
  const newOrder = await prisma.order.create({
    data: {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      deliveryMethod: data.deliveryMethod,
      paymentMethod: data.paymentMethod,
      city: data.city,
      addressOrOffice: data.addressOrOffice,
      notes: data.notes,
      totalAmount,
      items: {
        create: orderItemsData
      }
    },
    include: { items: true } 
  });

  // 4. Trigger Email Mocks
  sendOrderConfirmationToCustomer(data.customerEmail, data.customerName, newOrder.id, totalAmount).catch(console.error);
  sendNewOrderAlertToAdmin(newOrder.id, data.deliveryMethod).catch(console.error);

  return newOrder;
};

/**
 * Fetch all orders for the Admin Dashboard
 */
export const getAllOrders = async () => {
  return await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } } 
  });
};