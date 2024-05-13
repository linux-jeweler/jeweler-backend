import express from 'express';
import cors from 'cors';

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  return app;
}

export default createServer;

module.exports = createServer;
