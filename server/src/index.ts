import app from './app';
import config from './config';
import logger from './utils/logger';
import { Request, Response, NextFunction } from 'express';

// --- WILDCARD CORS MIDDLEWARE (FINAL TEST) ---
// This is a special middleware for debugging.
// It will add the CORS header with a "*" which means "allow everyone".
const wildcardCorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // We are setting the header to '*' for this test.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
};

// Apply our custom wildcard middleware to the entire app.
app.use(wildcardCorsMiddleware);


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

