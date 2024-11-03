import 'dotenv/config';

export default {
    token: process.env.TOKEN as string, // Bot Token
    useDB: true, // Use MongoDB, set to false if you don't want to use MongoDB
    db: {
        uri: process.env.MONGO_URI as string, // MongoDB URI
        options: {} // MongoDB Connection Options
    },
    directories: {
        commands: 'commands', // Commands Directory
        events: 'events', // Events Directory
        handlers: 'handlers' // Handlers Directory
    }
}