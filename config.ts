import { Config } from '@config';
import 'dotenv/config';

const config: Config = {
    token: process.env.TOKEN as string, // Bot Token
    client: {
        id: process.env.CLIENT_ID as string, // Bot Client ID
        secret: process.env.CLIENT_SECRET as string // Bot Client Secret
    },
    owner: '805771996687499275', // Bot Owner ID
    useDB: false, // Use MongoDB, set to false if you don't want to use MongoDB
    db: {
        uri: process.env.MONGO_URI as string, // MongoDB URI
    },
    directories: {
        commands: 'commands', // Commands Directory
        events: 'events', // Events Directory
        handlers: 'handlers' // Handlers Directory
    },
    status: {
        status: 'dnd', // Bot Status (online, idle, dnd, invisible)
        activity: 'with @discord-user', // Activity Text
        type: 'LISTENING', // Activity Type (PLAYING, WATCHING, LISTENING, STREAMING, CUSTOM)
        url: '' // Twitch URL (only for STREAMING)
    }
}

export default config;