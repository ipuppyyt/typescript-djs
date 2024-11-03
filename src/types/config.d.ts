
declare module '@config' {
    interface Config {
        token: string;
        client: {
            id: string;
            secret: string;
        };
        owner: string;
        useDB: boolean;
        db: {
            uri?: string;
        };
        directories: {
            commands: string;
            events: string;
            handlers: string;
        };
        status: {
            status: 'online' | 'idle' | 'dnd' | 'invisible';
            activity: string;
            type: 'PLAYING' | 'WATCHING' | 'LISTENING' | 'STREAMING' | 'CUSTOM';
            url?: string;
        };
    }
}
