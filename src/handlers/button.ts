import { Client, Events, Interaction } from 'discord.js';
import { error } from 'console';
import path from 'path';
import fs from 'fs';

interface Button {
    id: string;
    execute: (interaction: Interaction, client: Client) => Promise<void>;
}

const debugmode = process.env.NODE_ENV === 'dev';

const loadButtons = (dir: string): Record<string, Button> => {
    const buttons: Record<string, Button> = {};
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            Object.assign(buttons, loadButtons(filePath));
        } else if (file.endsWith('.js') || file.endsWith('.ts')) {
            const button: Button = require(filePath).default;
            buttons[button.id] = button;
        }
    }

    return buttons;
};

const buttons = loadButtons(path.join(__dirname, '../actions/button'));

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction, client: Client) {
        if (!interaction.isButton()) return;
        try {
            if (buttons[interaction.customId]) {
                await buttons[interaction.customId].execute(interaction, client);
            } else {
                debugmode && error(`📝 [DEBUG]: Button ${interaction.customId} not found.`.magenta.bold);
                await interaction.reply({ content: 'Button not found!', ephemeral: true });
            }
        } catch (err) {
            debugmode && error(`📝 [DEBUG]: Error executing button ${interaction.customId}: ${err}`.magenta.bold);
            await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
        }
    },
};
