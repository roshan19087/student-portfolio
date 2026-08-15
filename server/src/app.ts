import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { corsConfig } from './config/cors.config.js';
import { env } from './config/env.config.js';
import { httpLogger } from './middlewares/logger.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { apiV1Router } from './routes/index.js';
import { AppError } from './utils/AppError.js';
import { HealthCheckResponse } from '@portfolio/shared';

export const app = express();

// 1. Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // API does not serve HTML; allows frontend flexibility
    crossOriginEmbedderPolicy: false,
  }),
);

// 2. HTTP Response Compression (Gzip / Deflate for payloads > 1KB)
app.use(
  compression({
    threshold: 1024,
  }),
);

// 2. CORS
app.use(cors(corsConfig));

// 3. Cookie Parser
app.use(cookieParser());

// 4. Structured Request Logging
app.use(httpLogger);

// 5. Body Parsers with payload limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 6. Serve Local Uploads Statically (Safely jailed to uploads/ directory with HTTP caching)
app.use(
  '/uploads',
  express.static(path.resolve(process.cwd(), 'uploads'), {
    dotfiles: 'ignore',
    index: false,
    maxAge: '30d',
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400');
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  }),
);

// 7. Root Health Check
app.get('/health', (_req: Request, res: Response) => {
  const response: HealthCheckResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: env.NODE_ENV,
    version: '1.0.0',
  };

  res.status(200).json(response);
});

// 9. Mount API v1 Master Router
app.use('/api/v1', apiV1Router);

// 10. 404 Handler for undefined routes
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound(`Cannot ${req.method} ${req.originalUrl} - Endpoint does not exist`));
});

// 11. Centralized Error Handling Middleware
app.use(errorHandler);
