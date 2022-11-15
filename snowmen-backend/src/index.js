require("dotenv").config();
const app = require('./app');
const dbService = require('./services/db.service');

const server = app.listen(process.env.PORT, async () => {
  dbService.clear();
  console.log(`Listening to port ${process.env.PORT}`);
  await dbService.connect();
  console.log(`Connected!`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  if (server) {
    await dbService.close();
    server.close();
  }
});
