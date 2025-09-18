import app from './app';
import config from './config';
import logger from './utils/logger';
import { Request, Response, NextFunction } from 'express';

// --- CUSTOM CORS MIDDLEWARE (FINAL TEST) ---
// This function will run on EVERY request that hits the server.
const forceCorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Define the websites that are allowed to connect.
  const allowedOrigins = [
    'https://siddhidivine.vercel.app',
    'https://siddhidivine-nqvfstgco-nerf-hps-projects.vercel.app'
  ];

  const origin = req.headers.origin;

  // Check if the incoming request's origin is on our approved list.
  if (origin && allowedOrigins.includes(origin)) {
    // If it is, add the required header to the response.
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Define what methods and headers are allowed.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // The browser sends an "OPTIONS" request before the real request (a "preflight" check).
  // We need to respond to this preflight check with a "204 No Content" status.
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  // Pass the request along to the next part of your application (your routes).
  next();
};

// --- APPLY OUR CUSTOM MIDDLEWARE ---
// We apply our custom CORS function to the entire app.
// This is now the very first thing that will run.
app.use(forceCorsMiddleware);


// --- START SERVER ---
const server = app.listen(config.port, () => {
  logger.info(`Server listening on port ${config.port}`);
});


// --- GRACEFUL SHUTDOWN LOGIC (No changes needed) ---
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

