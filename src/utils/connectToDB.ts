import mongoose from "mongoose";
import config from "../../config";
import { error, log } from "console";

export default async function connectToDB() {
    if (!config.db.uri) {
        throw new Error("Database URI is not defined");
    }
    await mongoose.connect(config.db.uri)
        .then(() => log('✔️  [MONGODB]: Connected'.green))
        .catch((err) => error(`❌ [MONGODB]: ${err.message}`.red));
}