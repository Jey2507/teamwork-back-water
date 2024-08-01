import mongoose from "mongoose";

import { env } from "../utils/env.js";

export const initMongoDB = async () => {
    try {
        const user = env('MONGODB_USER');
        const password = env('MONGODB_PASSWORD');
        const url = env('MONGODB_URL');
        const db = env('MONGODB_DB');

        await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=FirstCluster`);
        console.log("Mongo connection successful");

    } catch (error) {
        console.log('Error while setting up mongo connection', error);
    throw error;
    }
};