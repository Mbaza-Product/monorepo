import { Injectable, Logger } from '@nestjs/common';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { PGConfiguration } from './pg.configuration';

/**
 * Abstraction over the connectivity to the PosgreSQL Database 
 */
@Injectable()
export class PGConnection {
  
  private logger: Logger = new Logger(PGConnection.name);
  
  private connection: Connection;

  /**
   * Creates a new PosgresSQL Database Connection
   * @constructor
   * @param {string} host - The host of the PG Database server. When not provided, *localhost* will be used instead
   * @param {number} port - The port the PG Database server listens on. When not provided, *5432* will be used instead
   * @param {string} username - Username of the user with credentials to connect to the database
   * @param {string} password - Password of the user with credentials to connect to the database
   * @param {string} database - The database the connection will be made to
   * @param {any} entities - An optional list of entities for that the connection will provide Repositories for
   */
  constructor(
    private configuration: PGConfiguration,
    private entities?: any,
  ) {    
  }
 
  /**
   * Creates the actual connection
   */
  async connect():Promise<boolean> {    
    const config:ConnectionOptions = {
      name: this.configuration.name,
      type: 'postgres',
      host: this.configuration.hostname || 'localhost',
      port: this.configuration.port || 5432,
      username: this.configuration.username,
      password: this.configuration.password,
      database: this.configuration.database,
      entities: this.entities,
      synchronize: true,
    };

    this.logger.debug(`Connecting to PGSQL: ${JSON.stringify(config, null, 2)}`);
    try {
      this.connection = await createConnection(config);
      return true;
    }
    catch (ex){
      this.logger.error(`Failed to connect to the database`);
      this.logger.error(ex);
    }

    return false;
  }

  /**
   * Closes the database connection
   */
  async close() {
    await this.connection.close();
    this.connection = null;
  }

  /**
   * Provides access to the actual connection
   */
  get connectionInstance(): Connection {
    return this.connection;
  }
}
