declare module 'discord-api-types/v10' {
    export const Routes: {
        applicationCommands: (clientId: string) => string;
        applicationGuildCommands: (clientId: string, guildId: string) => string;
    };
}
