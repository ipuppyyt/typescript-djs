import { Client } from "discord.js";
import config from "../../config";

export default (client: Client) => {
    if (!client.user) return;
    switch (config.status.type) {
        case 'PLAYING':
            client.user.setPresence({
                status: config.status.status,
                activities: [{ name: config.status.activity, type: 0 }],
            });
            break;
        case 'WATCHING':
            client.user.setPresence({
                status: config.status.status,
                activities: [{ name: config.status.activity, type: 3 }],
            });
            break;
        case 'LISTENING':
            client.user.setPresence({
                status: config.status.status,
                activities: [{ name: config.status.activity, type: 2 }],
            });
            break;
        case 'STREAMING':
            client.user.setPresence({
                status: config.status.status,
                activities: [{ name: config.status.activity, type: 1, url: config.status.url }],
            });
            break;
        case 'CUSTOM':
            client.user.setPresence({
                status: config.status.status,
                activities: [{ name: config.status.activity, type: 4 }],
            });
            break;
    }
}