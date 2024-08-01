import express from "express";
import pino from "pino-http";
import cors from "cors";

import notFoundHanler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

import { env } from "./utils/env.js";

const PORT = env("PORT", "3003");

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use(
        pino({
            transport: {
              target: 'pino-pretty',
            },
          }),
    );

    app.use(errorHandler);
    app.use(notFoundHanler);
   
    app.listen(PORT,() => {
        console.log(`Server is running on port ${PORT}`);
    });
};