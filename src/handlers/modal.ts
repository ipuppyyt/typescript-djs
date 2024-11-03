import { Events, Interaction } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { Client } from 'discord.js';
import { error } from 'console';

interface Modal {
    id: string;
    execute: (interaction: Interaction, client: Client) => Promise<void>;
}

const debugmode = process.env.NODE_ENV === 'dev';

const loadModals = (dir: string): Record<string, Modal> => {
    const modals: Record<string, Modal> = {};
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            Object.assign(modals, loadModals(filePath));
        } else if (file.endsWith('.js') || file.endsWith('.ts')) {
            const modal: Modal = require(filePath).default;
            modals[modal.id] = modal;
        }
    }

    return modals;
};

const modals = loadModals(path.join(__dirname, '../actions/modal'));

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction, client: Client) {
        if (!interaction.isModalSubmit()) return;
        try {
            if (modals[interaction.customId]) {
                await modals[interaction.customId].execute(interaction, client);
            } else {
                debugmode && error(`📝 [DEBUG]: Modal ${interaction.customId} not found.`.magenta.bold);
                await interaction.reply({ content: 'Modal not found!', ephemeral: true });
            }
        } catch (err) {
            debugmode && error(`📝 [DEBUG]: Error executing modal ${interaction.customId}: ${err}`.magenta.bold);
            await interaction.reply({
                content: 'There was an error while executing this modal!',
                ephemeral: true,
            });
        }
    },
};
