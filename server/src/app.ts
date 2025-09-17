import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import httpStatus from 'http-status';
import config from './config';
import { errorConverter, errorHandler } from './middleware/error.middleware';
import ApiError from './utils/AppError';
import apiRoutes from './routes';

const app: Express = express();

// Set security HTTP headers
app.use(helmet());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Enable cors
app.use(cors({ origin: config.clientOrigin }));

// Morgan for logging HTTP requests in dev
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api', apiRoutes);

// Send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);

// --- ADD THIS ROOT ROUTE ---
// This route will handle requests to your base URL
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the Siddhidivine API!',
    status: 'ok',
  });
});

export default app;