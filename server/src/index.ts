import app from './app';
import cors from 'cors';
import config from './config';
import logger from './utils/logger';

const server = app.listen(config.port, () => {
  logger.info(`Server listening on port ${config.port}`);
});

app.use(
  cors({
    origin: config.clientOrigin, // This uses the environment variable
    credentials: true,
  })
);

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