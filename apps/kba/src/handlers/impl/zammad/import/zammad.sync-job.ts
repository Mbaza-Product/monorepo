import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IntentHandler, IntentModel } from '../../../../models/intents.entity';
import { IntentService } from '../../../../intent/intent.service';
import { ZammadService } from './zammad.service';
import { ZammadUtils } from './zammad.utils';
import { ZammadMappingUtils } from './zammad.mapping-utils';

/**
 * CronJob used to synchronize the Zammad database with the internal Intents storage
 */
@Injectable()
export class ZammadSynchronizationJob {
  
  private logger: Logger = new Logger(ZammadSynchronizationJob.name);

  private synchronizing = false;

  constructor(private zammadService: ZammadService, private intentService: IntentService) {
    this.logger.debug(`Zammad synchronisation schedule: ${ZammadSynchronizationJob.getSyncSchedule()}`)
    this.logger.debug(`Zammad synchronisation enabled: ${this.isZammadSyncEnabled()}`)
  }
  static getSyncSchedule() {
    return process.env['SYNC_SCHEDULE'] || '0 */15 * * * *';
  }
  
  @Cron(ZammadSynchronizationJob.getSyncSchedule())
  async synchronizeContent() {

    if (!this.isZammadSyncEnabled()) {

      this.logger.warn('Zammad content synchronization is disabled. Exiting.');
      return;
    }

    this.logger.log('Starting Zammad content synchronization');

    // Ensure that we're only running the cronjob once at the same time
    if (this.synchronizing) {
      this.logger.warn('Zammad content synchronization already running. Skipping.');
      return;
    }

    this.synchronizing = true;

    // Fetching the hierarchy of content based on the root category
    this.zammadService.emptyCache();
    const hierarchy = await this.zammadService.getHierarchy(null, true);
    ZammadUtils.expandDefaultTags(hierarchy);

    // The hierarchy is now converted to a flat list of answers
    const answers = ZammadUtils.flattenHierarchy(hierarchy);
    this.logger.debug(`Found ${answers.length} Zammad answers. Converting them to KBA intents.`);

    // Map the zammad answers to intents
    const intents = answers
      .filter(ZammadMappingUtils.answersWithIntent)
      .map(ZammadMappingUtils.answerToIntent);

    this.logger.debug(`Found ${intents.length} intents.`);

    // Remove all KB intents from the storage as new ones will be added
    this.intentService.clearIntents(IntentHandler.KB);

    // Add all discovered intents into the DB
    for (const intent of intents) {
      this.logger.debug(`Saving intent ${JSON.stringify(intent, null,2)} intents.`);
      await this.intentService.saveIntent(intent);
    }

    this.logger.log('Zammad content synchronization completed');

    this.synchronizing = false;
  }

  isZammadSyncEnabled(): boolean {
    return process.env['ENABLE_SYNC'] == 'true';
  }
}
