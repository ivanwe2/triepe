import { Request, Response } from 'express';
import * as orderService from '../services/order.service';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderData = req.body;

    if (!orderData.customerName || !orderData.customerEmail || !orderData.customerPhone || !orderData.items || orderData.items.length === 0) {
      res.status(400).json({ status: 'error', message: 'Missing required customer details or cart is empty.' });
      return;
    }

    const newOrder = await orderService.createOrder(orderData);
    res.status(201).json({ status: 'success', data: newOrder });

  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ status: 'success', data: orders });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// FIX: Added the controller method for fetching a single order
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id as string);
    res.status(200).json({ status: 'success', data: order });
  } catch (error: any) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Status is required' 
      });
    }

    const updatedOrder = await orderService.updateOrderStatus(id as string, status);
    
    res.status(200).json({ 
      status: 'success', 
      data: updatedOrder 
    });
  } catch (error: any) {
    res.status(400).json({ 
      status: 'error', 
      message: error.message || 'Failed to update order status' 
    });
  }
};