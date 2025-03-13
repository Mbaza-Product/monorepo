import { CacheModule, Module } from '@nestjs/common';
import { IntentHandlerFactory } from './handlers/intent-handler.factory';
import { IntentController } from './intent/intent.controller';
import { IntentService } from './intent/intent.service';
import { IntentModel } from './models/intents.entity';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ZammadActionHandler } from './handlers/impl/zammad/zammad.action-handler';
import { ExternalApiActionHandler } from './handlers/impl/external/external-api.action-handler';
import { ScheduleModule } from '@nestjs/schedule';
import { ZammadSynchronizationJob } from './handlers/impl/zammad/import/zammad.sync-job';
import { PGConnection } from './database/pg.connection';
import { ZammadService } from './handlers/impl/zammad/import/zammad.service';
import { StaticContentHandler } from './handlers/impl/static/static-content.handler';
import { QueryRunner } from 'typeorm';
import { PGConfiguration } from './database/pg.configuration';
import { ZammdSyncTrigger } from './handlers/impl/zammad/import/zammd.sync-trigger';
import { KBAAuditModel } from './models/kba-audit.entity';

/**
 * Main Application modules. 
 * Defines the imported 3rd party modules, the Dependency injection providers and the primary Controller.
 */
@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot()
  ],
  controllers: [ZammdSyncTrigger, IntentController],
  providers: [    
    ZammadService,
    IntentService,
    IntentHandlerFactory,
    ZammadActionHandler,
    StaticContentHandler,
    ExternalApiActionHandler,
    ZammadSynchronizationJob,
    {
      provide: "INTENT_DATABASE",
      useFactory: async () => {
        const connection = new PGConnection(new PGConfiguration("INTENT_DB"), [IntentModel, KBAAuditModel]);        
        if (await connection.connect()) {
          return connection;
        }

        return null;
      },
    },
    {
      provide: "ZAMMAD_DATABASE",
      useFactory: async () => {
        const connection = new PGConnection(new PGConfiguration("ZAMMAD_DB"), []);        
        if (await connection.connect()) {
          return connection;
        }

        return null;
      },
    },
    {
      provide: "ZAMMAD_QUERY_RUNNER",
      useFactory: async(conn: PGConnection): Promise<QueryRunner> => {
          if (conn) {
            return conn.connectionInstance.createQueryRunner();      
          }
      }, 
      inject: ["ZAMMAD_DATABASE"]
    }
  ],
  exports: [
    IntentService,
    IntentHandlerFactory,
    ZammadActionHandler,
    ExternalApiActionHandler,
  ],
})
export class AppModule {}
