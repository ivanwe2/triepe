import { prisma } from '../config';
import { DeliveryMethod, PaymentMethod, OrderStatus } from '@prisma/client';
import {
  sendOrderConfirmationToCustomer,
  sendNewOrderAlertToAdmin,
  sendOrderConfirmedToCustomer,
  sendOrderShippedToCustomer,
  sendOrderCompletedToCustomer,
} from './email.service';

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  country?: string;
  city?: string;
  zipCode?: string;
  address?: string;
  addressOrOffice?: string;
  notes?: string;
  privacyConsentAt: string;
  items: { productId: string; quantity: number; size: string }[];
}

const getShippingCost = (method: DeliveryMethod, address: string = ''): number => {
  if (method === 'IN_STORE') return 0.00;

  const upperAddress = address.toUpperCase();
  const isAddress = upperAddress.includes('ADDRESS');
  
  if (method === 'SPEEDY') {
    return isAddress ? 4.50 : 3.00;
  }
  if (method === 'ECONT') {
    return isAddress ? 5.00 : 3.50;
  }
  
  return 0.00;
};

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

      // 3. Auto-update product status
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
      
      // Save the snapshot of the product!
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        size: item.size,
        priceAtBuy: product.price,
        productTitle: product.title, 
        productImage: product.image  
      });
    }

    // 4. Calculate Dynamic Shipping
    const shippingCost = getShippingCost(data.deliveryMethod, data.addressOrOffice || data.address || '');
    const totalAmount = subtotal + shippingCost;

    // 5. Create the Order Record
    const newOrder = await tx.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        deliveryMethod: data.deliveryMethod,
        paymentMethod: data.paymentMethod,
        country: data.country || null,
        city: data.city || null,
        zipCode: data.zipCode || null,
        address: data.address || null,
        addressOrOffice: data.addressOrOffice || null,
        notes: data.notes || null,
        privacyConsentAt: new Date(data.privacyConsentAt),
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
  sendOrderConfirmationToCustomer(
    data.customerEmail, 
    data.customerName, 
    result.newOrder.id, 
    result.totalAmount
  ).catch(console.error);

  sendNewOrderAlertToAdmin(
    result.newOrder.id, 
    data.deliveryMethod
  ).catch(console.error);

  return result.newOrder;
};

export const getAllOrders = async () => {
  return await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } } 
  });
};

// FIX: Added the missing getOrderById function
export const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } }
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) throw new Error('Order not found');

  const updated = await prisma.order.update({ where: { id }, data: { status } });

  if (status === OrderStatus.CONFIRMED) {
    sendOrderConfirmedToCustomer(existing.customerEmail, existing.customerName, id).catch(console.error);
  } else if (status === OrderStatus.SHIPPED) {
    sendOrderShippedToCustomer(existing.customerEmail, existing.customerName, id, existing.deliveryMethod).catch(console.error);
  } else if (status === OrderStatus.COMPLETED) {
    sendOrderCompletedToCustomer(existing.customerEmail, existing.customerName, id).catch(console.error);
  }

  return updated;
};