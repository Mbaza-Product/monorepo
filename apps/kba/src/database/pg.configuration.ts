import { Injectable } from "@nestjs/common";

/**
 * Contains the PostgreSQL configuration used to connect to specific DB instances
 */
export class PGConfiguration {

    constructor(private envPrefix: string) {        
    }

    get name(): string {
        return this.envPrefix;
    }

    get hostname(): string {
        return process.env[`${this.envPrefix}_HOST`] || "localhost";
    }


    get port(): number {
        const port = Number(process.env[`${this.envPrefix}_PORT`] || "5432");        
        return isNaN(port) ? 5432 : port;
    }
    
    get database(): string {
        return process.env[`${this.envPrefix}_NAME`];
    }

    get username(): string {
        return process.env[`${this.envPrefix}_USERNAME`];
    }

    get password(): string {
        return process.env[`${this.envPrefix}_PASSWORD`];
    }
}