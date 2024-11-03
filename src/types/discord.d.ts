import { Client, GatewayIntentBits as OriginalGatewayIntentBits, InteractionReplyOptions } from 'discord.js';

declare module 'discord.js' {
    interface Client {
        commands: Map<string, any>;
    }
    export enum ButtonStyle {
        Primary = 1,
        Secondary = 2,
        Success = 3,
        Danger = 4,
        Link = 5,
    }
    export const GatewayIntentBits: typeof OriginalGatewayIntentBits;
}
