import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.util';

// Extend the Express Request to include our custom user payload
export interface AuthRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware to ensure the request has a valid JWT token.
 */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    if (token == undefined) {
        throw Error("No token.");
    }
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user to the request object
    next();
  } catch (error) {
    res.status(403).json({ status: 'error', message: 'Forbidden: Invalid or expired token' });
  }
};

/**
 * Middleware to ensure the authenticated user is an ADMIN.
 * MUST be used AFTER requireAuth.
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ status: 'error', message: 'Forbidden: Admin access required' });
    return;
  }
  next();
};