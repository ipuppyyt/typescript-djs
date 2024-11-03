declare module '@discordjs/rest' {
    export class REST {
        constructor(options: { version: string });
        setToken(token: string): this;
        put(route: string, body: any): Promise<any>;
    }
}
