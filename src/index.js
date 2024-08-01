import { setupServer } from "./server.js";
import { initMongoDB } from "./db/initMongoConnection.js";

const bootstrap = async () => {
    await initMongoDB();
    setupServer();
};

bootstrap();