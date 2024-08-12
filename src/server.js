import express from "express";
import pino from "pino-http";
import cors from "cors";
import cookieParser from 'cookie-parser';


import notFoundHanler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import { env } from "./utils/env.js";
import router from './routers/index.js';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = env("PORT", "3003");

export const setupServer = () => {
  const app = express();

  app.use(express.json());

  const corsOptions = {
    origin: ['https://aqua-teamwork-app.vercel.app', 'http://localhost:5173', 'https://aqua-app-teamwork.onrender.com'], // URL of websites
    credentials: true, // turns on credentials
  };

  app.use(cors(corsOptions));
  // app.use(pino());
  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );

  app.use(cookieParser());

  app.use('/', router);

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('/api-docs', swaggerDocs());

  app.use(errorHandler);
  app.use(notFoundHanler);


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
