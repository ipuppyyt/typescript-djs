import { Client, ButtonInteraction } from "discord.js";


interface ButtonAction {
    id: string;
    execute(interaction: ButtonInteraction, client: Client): Promise<void>;
}

const buttonAction: ButtonAction = {
    id: 'example_id',
    async execute(interaction: ButtonInteraction, client: Client) {
        await interaction.reply({ content: 'Example button clicked!', ephemeral: true });
    }
};

export default buttonAction;