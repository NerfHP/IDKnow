import app from './app';
import cors from 'cors';
import config from './config';
import logger from './utils/logger';

// --- CORRECT CORS CONFIGURATION ---
// We get the allowed origins from an environment variable.
// This should be a comma-separated string in your Render settings.
// e.g., "https://siddhidivine.vercel.app,https://your-preview-url.vercel.app"
const allowedOrigins = config.clientOrigin ? config.clientOrigin.split(',') : [];

// For local development, we can add localhost to the list.
if (process.env.NODE_ENV !== 'production') {
    const localClient = 'http://localhost:3000'; // Or whatever port you use
    if (!allowedOrigins.includes(localClient)) {
        allowedOrigins.push(localClient);
    }
}

const corsOptions = {
    // The `origin` function checks if the incoming request URL is in our trusted list.
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // We allow requests if their origin is in our `allowedOrigins` array,
        // or if the request has no origin (like from Postman or a mobile app).
        if (origin && allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            logger.error(`CORS blocked for origin: ${origin}`);
            callback(new Error('This origin is not allowed by CORS'));
        }
    },
    credentials: true,
};

// --- APPLY MIDDLEWARE ---
// IMPORTANT: You MUST apply middleware like `cors` BEFORE starting the server.
// This ensures every request is checked against your CORS policy.
app.use(cors(corsOptions));


// --- START SERVER ---
// Now, we start the server AFTER the middleware is ready.
const server = app.listen(config.port, () => {
  logger.info(`Server listening on port ${config.port}`);
});


// --- GRACEFUL SHUTDOWN LOGIC (No changes needed here) ---
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

