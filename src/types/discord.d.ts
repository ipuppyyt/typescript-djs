import { Client } from 'discord.js';

declare module 'discord.js' {
    interface Client {
        commands: Map<string, any>;
    }
}
