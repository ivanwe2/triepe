import { Request, Response } from 'express';
import * as productService from '../services/product.service';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ status: 'success', data: products });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id as string);
    
    if (!product) {
      res.status(404).json({ status: 'error', message: 'Product not found' });
      return;
    }
    
    res.status(200).json({ status: 'success', data: product });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    // Expected body: { id, title, price, category, image, status, description }
    const productData = req.body;
    
    if (!productData.id || !productData.title || !productData.price || !productData.image) {
      res.status(400).json({ status: 'error', message: 'Missing required fields' });
      return;
    }

    const newProduct = await productService.createProduct(productData);
    res.status(201).json({ status: 'success', data: newProduct });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedProduct = await productService.updateProduct(id as string, req.body);
    res.status(200).json({ status: 'success', data: updatedProduct });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id as string);
    res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};