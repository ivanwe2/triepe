import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PORT } from './config';

// Import Routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import cookieParser from 'cookie-parser';

const app = express();

// ==========================================
// SECURITY & MIDDLEWARE
// ==========================================
app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://triepe.com', 'https://www.triepe.com'] 
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Apply Rate Limiting to all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// ==========================================
// ROUTES
// ==========================================
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Triepe API is healthy.' });
});

// Mount modular routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR]: ${err.message}`);
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// ==========================================
// BOOTSTRAP
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});