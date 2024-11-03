import mongoose from "mongoose";
import config from "../../config";
import { error, log } from "console";

async function connectToDB() {
    await mongoose.connect(config.db.uri, config.db.options)
        .then(() => log('✔️  [MONGODB]: Connected'.green))
        .catch((err) => error(`❌ [MONGODB]: ${err.message}`.red));
}

export default connectToDB;