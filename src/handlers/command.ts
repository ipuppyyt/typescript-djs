import { Client, Events, PermissionsBitField, userMention, Interaction, ChatInputCommandInteraction, GuildMember } from "discord.js";
import config from "../../config";
import { error } from "console";

const debugmode = process.env.NODE_ENV === 'dev';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction, client: Client) {
        if (!interaction.isCommand()) return;
        const slashInteraction = interaction as ChatInputCommandInteraction;

        const command = client.commands.get(slashInteraction.commandName);
        if (!command) {
            debugmode && error(`📝 [DEBUG]: Command ${slashInteraction.commandName} not found.`.magenta.bold);
            return;
        }
        try {
            if (command.admin && !(interaction.member as GuildMember)?.permissions.has(PermissionsBitField.Flags.Administrator)) {
                await interaction.reply({
                    content: `This command is restricted to server administrators only.`,
                    ephemeral: true,
                });
                return;
            }

            if (command.owner && slashInteraction.user.id !== config.owner) {
                await slashInteraction.reply({
                    content: `This command is restricted to the ${userMention(config.owner)} only.`,
                    ephemeral: true,
                });
                return;
            }

            await command.execute(slashInteraction, client);
        } catch (err) {
            debugmode && error(`📝 [DEBUG]: Error executing command ${command.data.name}: ${err}`.magenta.bold);
            await slashInteraction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
