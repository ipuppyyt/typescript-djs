import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { version as discordJSVersion } from 'discord.js';
import { version as nodeVersion } from 'process';
import packageJson from '../../package.json';
import { formatUptime } from '../utils';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with bot stats'),

    global: true,

    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        const ping = client.ws.ping;
        const uptime = client.uptime && formatUptime(client.uptime);
        const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
        const numServers = client.guilds.cache.size;
        const numUsers = client.users.cache.size;
        const apiLatency = client.ws.ping;
        const version = packageJson.version;
        const embedcolor = '#7289DA';

        const drpbtn = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Developer')
            .setEmoji('🛠️')
            .setURL('https://github.com/ipuppyyt');
   
        const btnrow = new ActionRowBuilder<ButtonBuilder>().addComponents(drpbtn);

        const pingembed = new EmbedBuilder()
            .setColor(embedcolor)
            .setAuthor({ name: `${client?.user?.username} Stats`, iconURL: client?.user?.avatarURL() || undefined })
            .addFields(
                { name: ':ping_pong: Ping', value: `┕ ${ping} ms`, inline: true },
                { name: ':clock1: Uptime', value: '┕ ' + uptime, inline: true },
                { name: ':file_cabinet: Memory', value: `┕ ${Math.round(memoryUsage * 100) / 100} MB`, inline: true },
                { name: ':desktop: Servers', value: `┕ ${numServers}`, inline: true },
                { name: ':busts_in_silhouette: Users', value: `┕ ${numUsers}`, inline: true },
                { name: ':satellite: API Latency', value: `┕ ${apiLatency} ms`, inline: true },
                { name: ':robot: Version', value: `┕ v${version}`, inline: true },
                { name: ':blue_book: Discord.js', value: `┕ v${discordJSVersion}`, inline: true },
                { name: ':green_book: Node.js', value: `┕ v${nodeVersion}`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() || undefined });

        await interaction.reply({ embeds: [pingembed], components: [btnrow] });
    },
};
