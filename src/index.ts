import { Client, GatewayIntentBits } from 'discord.js';
import { clear, error, log, warn } from 'console';
import { connectToDB } from './utils';
import { pathToFileURL } from 'url';
import { readdirSync } from 'fs';
import config from '../config';
import { join } from 'path';
import 'colors';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.AutoModerationConfiguration
    ]
});

client.commands = new Map();
const debugmode = process.env.NODE_ENV === 'dev';

clear();
log(`📝 [DEBUG]: ${debugmode ? 'Enabled' : 'Disabled'}`.white.bold);
log('🚀 [STARTING]: Booting Up'.cyan);

// Connect to MongoDB if enabled
if (config.useDB) {
    log('⏳ [MONGODB]: Connecting'.cyan);
    if (!config.db.uri) error('❌ [MONGODB]: MongoDB URI is not defined.'.red);
    else connectToDB();
}

// Load commands
log('⏳ [LOADING]: Commands'.cyan);
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const commandCount = commandFiles.length;
    debugmode && log(`📝 [DEBUG]: ${commandCount} command${commandCount > 1 ? 's' : ''} found.`.magenta.bold);
    import(pathToFileURL(filePath).toString()).then(({ default: command }) => {
        if (command.command === false) return;
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
        }
    }).catch(err => error(`❌ Failed to load command ${file}: ${err.message}`.red));
}
log('✔️  [LOADING]: Commands Complete'.green);

// Load events
console.log('⏳ [LOADING]: Events'.cyan);
const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const eventCount = eventFiles.length;
    debugmode && log(`📝 [DEBUG]: ${eventCount} event${eventCount > 1 ? 's' : ''} found.`.magenta.bold);
    import(pathToFileURL(filePath).toString()).then(({ default: event }) => {
        if (event.name) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        } else error(`❌ The event file at ${filePath} is missing a required "name" property.`.red);
    }).catch(err => console.error(`❌ Failed to load event ${file}: ${err.message}`.red));
}
log('✔️  [LOADING]: Events Complete'.green);


// Load handlers
log('⏳ [LOADING]: Handlers'.cyan);
const handlersPath = join(__dirname, 'handlers');
const handlerFiles = readdirSync(handlersPath).filter(file => file.endsWith('.ts'));

for (const file of handlerFiles) {
    const filePath = join(handlersPath, file);
    const handlerCount = handlerFiles.length;
    debugmode && log(`📝 [DEBUG]: ${handlerCount} handler${handlerCount > 1 ? 's' : ''} found.`.magenta.bold);
    import(pathToFileURL(filePath).toString()).then(({ default: handler }) => {
        if (handler.name && handler.execute) {
            client.on(handler.name, (...args) => handler.execute(...args, client));
        } else {
            error(`❌ The handler at ${filePath} is missing a required "name" or "execute" property.`.red);
        }
    }).catch(err => {
        error(`❌ Failed to load handler ${file}: ${err.message}`.red);
    });
}
log('✔️  [LOADING]: Handlers Complete'.green);


// Set up client error handling
client.on('error', err => error(`❌ [CLIENT ERROR]: ${err.message}`.red));
client.on('unhandledRejection', err => error('❌ [UNHANDLED PROMISE REJECTION]:', err.message.orange));
client.on('warn', warning => warn(`⚠️ [CLIENT WARN]: ${warning}`.yellow));


// Log in to Discord
log('⏳ [DISCORD]: Logging in'.cyan);
if (config.token) {
    client.login(config.token)
        .then(() => log(`✔️  [DISCORD]: ${client.user?.username} Online`.green))
        .catch(err => error(`❌ [DISCORD]: ${err.message}`.red));
} else {
    error('❌ [DISCORD]: Bot Token not provided'.red);
}
