import { prisma } from '../config';
import { DeliveryMethod, PaymentMethod, OrderStatus } from '@prisma/client';
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
  const result = await prisma.$transaction(async (tx) => {
    let subtotal = 0;
    const orderItemsData = [];

    // 1. Validate Stock and Calculate Total securely
    for (const item of data.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        include: {
          variants: {
            where: { size: item.size }
          }
        }
      });

      if (!product) {
        throw new Error(`Product ${item.productId} no longer exists.`);
      }

      const variant = product.variants[0];
      if (!variant) {
        throw new Error(`Size ${item.size} is not valid for ${product.title}.`);
      }

      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.title} (Size: ${item.size}). Only ${variant.stock} left.`);
      }

      // 2. Deduct the stock
      await tx.productVariant.update({
        where: { id: variant.id },
        data: { stock: { decrement: item.quantity } }
      });

      // 3. Auto-update product status if it just sold out globally
      const remainingVariants = await tx.productVariant.findMany({
        where: { productId: product.id }
      });
      
      const totalRemainingStock = remainingVariants.reduce((sum, v) => sum + v.stock, 0);
      
      if ((totalRemainingStock - item.quantity) <= 0) {
        await tx.product.update({
          where: { id: product.id },
          data: { status: 'SOLD OUT' }
        });
      }

      subtotal += product.price * item.quantity;
      
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        size: item.size,
        priceAtBuy: product.price
      });
    }

    // 4. Calculate Shipping
    const shippingCost = data.deliveryMethod === 'IN_STORE' ? 0 : 6.50;
    const totalAmount = subtotal + shippingCost;

    // 5. Create the Order Record (Mapping undefined to null to satisfy Prisma)
    const newOrder = await tx.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        deliveryMethod: data.deliveryMethod,
        paymentMethod: data.paymentMethod,
        city: data.city || null,                      // FIXED: undefined -> null
        addressOrOffice: data.addressOrOffice || null, // FIXED: undefined -> null
        notes: data.notes || null,                    // FIXED: undefined -> null
        totalAmount,
        items: {
          create: orderItemsData
        }
      },
      include: { items: true }
    });

    return { newOrder, totalAmount };
  });

  // 6. Fire Emails
  sendOrderConfirmationToCustomer(data.customerEmail, data.customerName, result.newOrder.id, result.totalAmount).catch(console.error);
  sendNewOrderAlertToAdmin(result.newOrder.id, data.deliveryMethod).catch(console.error);

  return result.newOrder;
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

/**
 * Update Order Status (Admin Only) - e.g., PENDING -> SHIPPED
 */
export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  return await prisma.order.update({
    where: { id },
    data: { status }
  });
};