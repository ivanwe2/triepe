import { CookieOptions, Request, Response } from 'express';
import * as authService from '../services/auth.service';

/**
 * POST /api/auth/login
 */
const isProd = process.env.NODE_ENV === 'production';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax', // 'none' allows cross-subdomain requests (Vercel -> GCP)
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days expiration
};

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

    res.cookie('jwt', result.token, cookieOptions);

    res.status(200).json({ 
      status: 'success', 
      data: { user: result.user } 
    });
    
  } catch (error: any) {
    res.status(401).json({ status: 'error', message: error.message });
  }
};

export const logout = (req: Request, res: Response): void => {
  const isProd = process.env.NODE_ENV === 'production';
  
  // Clear the cookie by setting its expiration date to the past
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });

  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

/**
 * POST /api/auth/register
 */
// export const register = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password, role } = req.body;

//     if (!email || !password) {
//       res.status(400).json({ status: 'error', message: 'Email and password are required' });
//       return;
//     }

//     const result = await authService.registerUser(email, password, role);
//     res.status(201).json({ status: 'success', data: result });

//   } catch (error: any) {
//     res.status(400).json({ status: 'error', message: error.message });
//   }
// };