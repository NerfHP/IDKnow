import app from './app';
import cors from 'cors';
import config from './config';
import logger from './utils/logger';

// --- CORS Configuration ---
// It's best practice to load your origins from environment variables.
// Store them as a single comma-separated string in your config.
// Example: CLIENT_ORIGIN="https://siddhidivine.vercel.app,https://siddhidivine-nqvfstgco-nerf-hps-projects.vercel.app"
const allowedOrigins = config.clientOrigin ? config.clientOrigin.split(',') : [];

// For local development, you might want to add your localhost URL.
if (process.env.NODE_ENV !== 'production') {
    if (!allowedOrigins.includes('http://localhost:3000')) {
      allowedOrigins.push('http://localhost:3000'); // Or your local client's port
    }
}

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // The !origin condition allows requests from tools like Postman or mobile apps
        if (origin && allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('This origin is not allowed by CORS'));
        }
    },
    credentials: true,
};

// --- Apply Middleware ---
// IMPORTANT: Middleware must be applied BEFORE the server starts listening.
// This ensures that every incoming request goes through the CORS check first.
app.use(cors(corsOptions));


// --- Start Server ---
const server = app.listen(config.port, () => {
  logger.info(`Server listening on port ${config.port}`);
});


// --- Graceful Shutdown and Error Handling (your existing code is good) ---
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
