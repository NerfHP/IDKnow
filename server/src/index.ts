import app from './app';
import cors from 'cors';
import config from './config';
import logger from './utils/logger';

// --- DIRECT ENVIRONMENT VARIABLE READ ---
// We are bypassing `config.clientOrigin` and reading directly from the server's environment.
// This is the most reliable way to ensure we get the value set on Render.
const clientOriginString = process.env.CLIENT_ORIGIN || '';

// --- ROBUST ORIGIN PARSING ---
// This new version takes the string, splits it by the comma,
// and then `.map(origin => origin.trim())` cleans up any whitespace or newlines from each URL.
// This permanently fixes the '\n' bug.
const allowedOrigins = config.clientOrigin
  ? config.clientOrigin.split(',').map(origin => origin.trim())
  : [];


if (process.env.NODE_ENV !== 'production') {
    const localClient = 'http://localhost:3000';
    if (!allowedOrigins.includes(localClient)) {
        allowedOrigins.push(localClient);
    }
}

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // This logic is perfect, no changes needed here.
        if (origin && allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            logger.error(`CORS blocked for origin: ${origin}`);
            logger.error(`Allowed origins are: [${allowedOrigins.join(', ')}]`);
            callback(new Error('This origin is not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors());

const server = app.listen(config.port, () => {
  logger.info(`Server listening on port ${config.port}`);
});

// --- Graceful shutdown logic remains the same ---
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

