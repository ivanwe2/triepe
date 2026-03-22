import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

/**
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ status: 'error', message: 'Email and password are required' });
      return;
    }

    const result = await authService.loginUser(email, password);
    res.status(200).json({ status: 'success', data: result });
    
  } catch (error: any) {
    res.status(401).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).json({ status: 'error', message: 'Email and password are required' });
      return;
    }

    const result = await authService.registerUser(email, password, role);
    res.status(201).json({ status: 'success', data: result });

  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};