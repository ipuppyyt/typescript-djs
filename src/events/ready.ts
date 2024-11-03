import { Routes } from "discord-api-types/v10";
import { Client, Events } from "discord.js";
import { readdirSync, statSync } from "fs";
import { REST } from "@discordjs/rest";
import { setActivity } from "../utils";
import { error, log } from "console";
import { pathToFileURL } from "url";
import config from "../../config";
import { join } from "path";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        log(`✔️  [DISCORD]: Logged In`.green);
        log('⏳ [COMMANDS]: Refreshing'.blue);

        const rest = new REST({ version: '10' }).setToken(config.token);

        const registerCommands = async (dir: string): Promise<{ globalCommands: any[]; guildCommands: any[] }> => {
            const globalCommands: any[] = [];
            const guildCommands: any[] = [];
            const files = readdirSync(dir);

            for (const file of files) {
                const filePath = join(dir, file);
                const stat = statSync(filePath);

                if (stat.isDirectory()) {
                    const { globalCommands: subGlobal, guildCommands: subGuild } = await registerCommands(filePath);
                    globalCommands.push(...subGlobal);
                    guildCommands.push(...subGuild);
                } else if (file.endsWith('.ts') || file.endsWith('.js')) {
                    try {
                        const commandModule = await import(pathToFileURL(filePath).toString());
                        const command = commandModule.default;
                        if (command.command === false) continue;
                        if (command.data && command.data.name) {
                            log(`✔️  [COMMANDS]: Loaded ${command.data.name}`.magenta);
                            client.commands.set(command.data.name, command);
                            if (command.global) {
                                globalCommands.push(command.data);
                            } else {
                                guildCommands.push(command.data);
                            }
                        } else {
                            log(`❌ [COMMANDS]: ${file} Invalid`.red);
                        }
                    } catch (error) {
                        log(`❌ [COMMANDS]: Error loading ${file}:`.red, error);
                    }
                }
            }

            return { globalCommands, guildCommands };
        };

        const commandsPath = join(__dirname, '../commands');
        const { globalCommands, guildCommands } = await registerCommands(commandsPath);

        try {
            const guilds = await client.guilds.fetch();
            await rest.put(Routes.applicationCommands(config.client.id), { body: globalCommands });
            log('✔️  [COMMANDS]: Registered Global'.green);
            for (const guild of guilds.values()) {
                await rest.put(Routes.applicationGuildCommands(config.client.id, guild.id), { body: guildCommands });
                log(`✔️  [COMMANDS]: Registered Guild ${guild.name}`.green);
            }
        } catch (err) {
            error('❌ [COMMANDS]: Error Registering', (err instanceof Error ? err.message : String(err)).red);
        }

        setActivity(client);
    },
};
