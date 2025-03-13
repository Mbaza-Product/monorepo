import { Inject, Injectable, Logger } from '@nestjs/common';
import { KBAAuditModel } from '../models/kba-audit.entity';
import { Repository } from 'typeorm';
import { PGConnection } from '../database/pg.connection';
import {
  IntentModel,
  IntentEntities,
  IntentHandler,
} from '../models/intents.entity';

type IntentSearchMatch = {
  matches: number;
  score: number;
  intent: IntentModel;
  expectedEntities: IntentEntities;
};

type PartialMatchStrategy = 'RASA' | 'KBA';

@Injectable()
export class IntentService {
  
  private logger: Logger = new Logger(IntentService.name);

  private static readonly FALLBACK_INTENT = "fallback";

  constructor(@Inject("INTENT_DATABASE") private conn: PGConnection) {}

  async getIntent(
    intent: string,
    entities: IntentEntities,
    locale: string,
  ): Promise<IntentModel | null> {
    try {
      

      const exactQuery = {
        intents: intent,
        entities: JSON.stringify(entities),
        locale: locale,
      };

      this.logger.debug(`Trying to find exact match for intent in the database: ${JSON.stringify(exactQuery, null, 2)}`);

      let actualIntent = await this.getRepository().findOne({where: exactQuery});

      if (actualIntent) {
        this.logger.debug(`Exact match found ${JSON.stringify(actualIntent)}!`);
        return actualIntent;
      }

      const defaultQuery = {
        intents: intent,
        entities: JSON.stringify({}),
        locale: locale,
      };

      this.logger.debug(`Trying to find intent only match in the database: ${JSON.stringify(defaultQuery, null, 2)}`);

      actualIntent = await this.getRepository().findOne({where: defaultQuery});

      if (actualIntent) {
        this.logger.debug(`Intent only match found ${JSON.stringify(actualIntent)}!`);
        return actualIntent;
      }

      this.logger.debug(`Trying to find partial/wildcard matches for intent in the database: ${JSON.stringify(exactQuery, null, 2)}`);

      let potentialIntents = await this.getRepository().find({
        where: {
          intents: intent,          
          locale: locale,
        },
      });

      actualIntent = this.handlePartialMatch(potentialIntents, entities);
      if (actualIntent) {
        this.logger.debug(`Partial match found ${JSON.stringify(actualIntent)}!`);
        return actualIntent;
      }
      
      this.logger.warn(`No match found!`);

      const fallbackQuery = {
        intents: IntentService.FALLBACK_INTENT,
        entities: JSON.stringify({}),
        locale: locale,
      };

      this.logger.debug(`Trying to find the fallback message in database: ${JSON.stringify(defaultQuery, null, 2)}`);
      actualIntent = await this.getRepository().findOne({where: fallbackQuery});

      if (actualIntent) {
        this.logger.debug(`Fallback message found: ${JSON.stringify(actualIntent)}!`);
        return actualIntent;
      }

      return null;
            
    } catch (ex) {      
      this.logger.error(`Unable to find intent in the repository: ${ex}`);
      this.logger.error(ex);
      return null;
    }
  }

  /**
   * Checks a list of entities (received from RASA) against a list of potential intents (from the DB).
   * The list of potential intents would been found based on different queries 
   * @param potentialIntents 
   * @param entities 
   * @returns 
   */
  handlePartialMatch(potentialIntents: IntentModel[], entities: IntentEntities): IntentModel {
    if (!potentialIntents || potentialIntents.length == 0) {
      this.logger.error(`No potential partial matching intents found!`);
      return null;
    }
      
    this.logger.debug(`Found ${potentialIntents.length} potential intents!`);          
    const matchedIntents = potentialIntents
      .map((item) => this.getMatchingEntities(item, entities))
      .filter(this.hasMinimalEntitiesPresent);

    if (matchedIntents.length > 0) {
      matchedIntents.sort(this.sortByScore());
      return matchedIntents[0].intent;
    }
    else {
      this.logger.warn(`No remaining partial matching intents after filtering!`);
    }

    return null;
  }

  /**
   * Deletes all intent of given type from the storage
   * @param intentType 
   */
  async clearIntents(intentType: IntentHandler) {
    await this.getRepository().delete({ handler: intentType });
  }

  /**
   * Saves the provided intent into the DB
   * @param intent 
   * @returns 
   */
  
  async saveIntent(intent: IntentModel): Promise<IntentModel | undefined> {
    try {
      this.logger.debug(`Adding intent: ${JSON.stringify(intent, null, 2)}`);
      const actualIntent = await this.getRepository().save(intent);

      return actualIntent;
    } catch (ex) {
      this.logger.error(`Unable to save intent in the repository: ${JSON.stringify(ex, null, 2)}`);
    }
  }

  /**
   * Saves the provided audit data into the DB
   * @param audit 
   */
  async saveAudit(audit: KBAAuditModel): Promise<void> {
    try {
      this.logger.debug(`Adding audit entry: ${JSON.stringify(audit, null, 2)}`);
      await this.getAuditRepository().save(audit);

    } catch (ex) {
      this.logger.error(`Unable to save audit in the repository: ${JSON.stringify(ex, null, 2)}`);
    }
  }

  getRepository(): Repository<IntentModel> {
    return this.conn.connectionInstance.getRepository(IntentModel);
  }

  getAuditRepository(): Repository<KBAAuditModel> {
    return this.conn.connectionInstance.getRepository(KBAAuditModel);
  }

  /**
   * Checks if the match has the minimum entities present
   * @param match 
   * @returns 
   */
  private hasMinimalEntitiesPresent(match: IntentSearchMatch): boolean {      
    return (match.matches === Object.getOwnPropertyNames(match.expectedEntities).length);
  }

  /**
   * Retrieve partial matches when either the extra Zammad entities or Rasa entities can be ignored
   * @param item 
   * @param entities 
   * @returns 
   */
  private getMatchingEntities(
    item: IntentModel,
    entities: IntentEntities
    
  ): IntentSearchMatch {
    let matches = 0;    
    let score = 0;
   
    const actualEntities = item.ignore_extra_rasa_entities ? item.entities : entities;
      for (const entity in actualEntities) {      
        const itemScore = this.getEntityMatchScore(entity, item, entities);
        if (itemScore > 0) {
          matches++;
          score += itemScore;
        }
      }          
      return { matches, score, intent: item, expectedEntities: entities};
  }


  /**
   * Calculates the matching score for an entity in a list of entities. 
   * Eg. an exact match will be 1, a wildcard match will be 0.5
   * @param entity 
   * @param item 
   * @param entities 
   * @returns 
   */

  private getEntityMatchScore(entity: string, item: IntentModel, entities: IntentEntities): number {
    const actualEntity = entity?.toLowerCase();
    if ((item.entities[actualEntity] === '*' && entities[actualEntity]?.toLocaleUpperCase()) ||
      (entities[actualEntity]?.toLocaleUpperCase() === item.entities[actualEntity]?.toLocaleUpperCase())) {
      if (entities[actualEntity]?.toLocaleUpperCase() === item.entities[actualEntity]?.toLocaleUpperCase()) {
        return 1;
      } else {
        return 0.5;
      }
    }
    return 0;
  }

  private sortByScore(): (a: IntentSearchMatch, b: IntentSearchMatch) => number {
    return (first, second) => {
      return first.score > second.score ? -1 : (first.score < second.score ? 1 : 0);
    };
  }
}
