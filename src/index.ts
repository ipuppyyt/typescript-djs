import { Client, GatewayIntentBits } from 'discord.js';
import { clear, error, log, warn } from 'console';
import { existsSync, readdirSync } from 'fs';
import { connectToDB } from './utils';
import config from '../config';
import { join } from 'path';
import 'colors';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Map();

clear();
log('🚀 [STARTING]: Bot'.cyan);

// Connect to MongoDB
if (config.useDB) {
    log('⏳ [MONGODB]: Connecting'.cyan);
    if (!config.db.uri) error('❌ [MONGODB]: MongoDB URI is not defined.'.red);
    else connectToDB();
}

// Load commands
log('⏳ [LOADING]: Commands'.cyan);
const commandsPath = join(__dirname, config.directories.commands);
if (existsSync(commandsPath)) {
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const command = require(filePath);
        if (command.command === false) continue;
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
        }
    }
    log('✔️  [LOADING]: Complete'.green);
} else {
    error(`❌ [LOADING]: Commands directory does not exist.`.red);
}

// Load events
log('⏳ [LOADING]: Events'.cyan);
const eventsPath = join(__dirname, config.directories.events);
if (existsSync(eventsPath)) {
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = join(eventsPath, file);
        const event = require(filePath);
        if (event.once) { client.once(event.name, (...args) => event.execute(...args, client)) }
        else { client.on(event.name, (...args) => event.execute(...args, client)) }
    }
    log('✔️  [LOADING]: Complete'.green);
}
else {
    error(`❌ [LOADING]: Events directory does not exist.`.red);
}

// Load handlers
log('⏳ [LOADING]: Handlers'.cyan);
const handlersPath = join(__dirname, config.directories.handlers);
if (existsSync(eventsPath)) {
    const handlerFiles = readdirSync(handlersPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of handlerFiles) {
        const filePath = join(handlersPath, file);
        const handler = require(filePath);
        if (handler.name && handler.execute) { client.on(handler.name, (...args) => handler.execute(...args, client)) }
        else { error(`❌ The handler at ${filePath} is missing a required "name" or "execute" property.`.red) }
    }
    log('✔️  [LOADING]: Complete'.green);
}
else {
    error(`❌ [LOADING]: Handlers directory does not exist.`.red);
}

// Add error handling
client.on('error', err => error(`❌ [CLIENT ERROR]: ${err.message}`.red));
client.on('unhandledRejection', err => error('❌ [UNHANDLED PROMISE REJECTION]:', err.message.orange));
client.on('warn', warning => warn(`⚠️ [CLIENT WARN]: ${warning}`.yellow));

// Login to Discord
log('⏳ [DISCORD]: Logging in'.cyan);
if (config.token) {
    client.login(config.token)
        .then(() => log('✔️  [DISCORD]: Logged in'.green))
        .catch(err => error(`❌ [DISCORD]: ${err.message}`.red));
} else error('❌ [DISCORD]: Bot Token not provided'.red);