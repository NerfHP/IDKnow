import app from './app';
import cors from 'cors';
import config from './config';
import logger from './utils/logger';

// --- HARDCODED ORIGIN FOR FINAL TEST ---
// We are temporarily ignoring environment variables and putting your website's URL directly into the code.
// This is the most direct way to enable CORS.
const allowedOrigins = [
  'https://siddhidivine.vercel.app',
  'https://siddhidivine-nqvfstgco-nerf-hps-projects.vercel.app'
];


const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
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

app.use(cors(corsOptions));

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

