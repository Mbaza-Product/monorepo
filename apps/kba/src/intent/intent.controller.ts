import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Cache, Store } from 'cache-manager';
import { IntentHandlerFactory } from '../handlers/intent-handler.factory';
import { IntentHandlerResponse } from '../handlers/intent-handler.response';
import { IntentEntities, IntentHandler } from '../models/intents.entity';
import { IntentEntity, IntentRequestModel } from './intent.request.model';
import { IntentService } from './intent.service';
import * as crypto from 'crypto';
import e, { Response } from 'express';
import { ALLOWED_LANGUAGES, DEFAULT_LOCALE, DEFAULT_RESPONSE, IntentLanguages, UNSUPPORTED_LANGUAGE_MESSAGE} from './intent.languages';
import { KBAAuditModel } from 'src/models/kba-audit.entity';

/**
 * Handles the intent requests.
 */
@Controller('')
export class IntentController {
  private logger: Logger = new Logger(IntentController.name);
  private lastError: string;

  private static readonly CACHE_TTL_IN_SECONDS = 60;
  constructor(
    private intentService: IntentService,
    private actionHandlerFactory: IntentHandlerFactory,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  setLastError(error:string): string {
    this.lastError = error;
    return this.lastError;
  }

  @Get('/')
  getHello(): string {
    return 'Hello';
  }

  @Get('cache/content')    
  async getCacheContent(): Promise<any> {
    const keys = await this.cacheManager.store.keys();
    const result = {};
    for (const key of keys) {
      result[key] = {
        value: await this.cacheManager.get(key)
      };
    }

    return result;
  }

  @Post('cache/clear')    
  async invalidateCache(): Promise<void> {
    await this.cacheManager.reset();
  }
  /**
   * 
   * @param {string} intent The name of the intent
   * @param {string} locale The locale (language) code
   * @param {IntentRequestModel} entitiesRequest The scored entities provided for the requested intent
   * @param {Response} response Holds the reference to the underlying ExpressJS Request, so that an HTTP status code,
   * specific to the operation, is being sent to the user.
   * @returns No response is being provided directly. However, a Promise<void> is returned to enable asynchronous processing
   */
  @Post(':locale/:intent')    
  async handleIntent(
    @Param('intent') intent: string,
    @Param('locale') locale: string,
    @Body() entitiesRequest: IntentRequestModel,
    @Res() response: Response
  ): Promise<void> {
    
    intent = intent.toLowerCase();
    const auditEntry: KBAAuditModel = {
      intent,
      locale,
      resolved: false
    };

    
  
    // Check if the requested locale is in the list of allowed Locales
    if (ALLOWED_LANGUAGES.indexOf(locale) <0) {
      this.logger.debug(this.setLastError(`Locale not supported ${locale}`));

      auditEntry.response = this.lastError;
      await this.intentService.saveAudit(auditEntry);
      
      response.status(HttpStatus.NOT_FOUND)
              .send(UNSUPPORTED_LANGUAGE_MESSAGE);  
      return;    
    }
  
    const entitiesContent = JSON.stringify(entitiesRequest, null, 2);
    this.logger.log(`Handling intent: ${intent}, entities = ${entitiesContent}, locale = ${locale}`);

    // Check if the request is actually valid
    const actualEntities = this.extractEntities(entitiesRequest);
    this.logger.log(`Actual entities found = ${JSON.stringify(actualEntities)}`);
    if (!actualEntities) {
      this.logger.warn(this.setLastError(`Invalid request received:${intent}, entities:${entitiesContent}}`));
      
      auditEntry.entities = entitiesContent;
      auditEntry.response = this.lastError;      
      await this.intentService.saveAudit(auditEntry);
      
      response.status(HttpStatus.NOT_ACCEPTABLE)
              .send(this.getDefaultResponseMessage(locale));
      return;
    }

    auditEntry.entities = JSON.stringify(actualEntities);
        
    // Checking if the cache contains a request for the same intent, locale and entities
    const request_hash = await this.getHash(intent, locale, entitiesRequest);
    const cached_response = await this.cacheManager.get(request_hash);

    if (cached_response) {
      this.logger.debug(`Returning cached response: intent:${intent}, entities:${entitiesContent}, response: ${JSON.stringify(cached_response)}`);
      response.status(HttpStatus.OK).send(cached_response);       
      await this.cacheManager.set(request_hash, cached_response, {ttl: IntentController.CACHE_TTL_IN_SECONDS});
      return;
    }

    // Search for the intent in the internal storage / database
    const actualIntent = await this.intentService.getIntent(intent, actualEntities, locale);
    if (!actualIntent) {
      this.logger.warn(this.setLastError(`Intent ${intent} with entities ${JSON.stringify(actualEntities, null, 2)} not found, returning default response`));
            
      auditEntry.response = this.lastError;      
      await this.intentService.saveAudit(auditEntry);
          
      response.status(HttpStatus.NOT_FOUND)
              .send(this.getDefaultResponseMessage(locale));              
      return;      
    }

    // Process the intent using the handler mapping retrieved from the internal storage
    const result = await this.processIntent(
      actualIntent.handler,
      actualIntent.metadata,
      actualEntities,
      locale
    );
    
    this.logger.debug(`Returning response from handler: intent:${intent}, entities:${entitiesContent},response:${JSON.stringify(result.response.message)} `);
    
    // Update the cache to speed up the next requests
    await this.cacheManager.set(request_hash, result.response.message, {ttl: IntentController.CACHE_TTL_IN_SECONDS});
    //await this.cacheManager.set(request_hash, result.response.message);
    
    auditEntry.response = result.response.message;
    auditEntry.resolved = true;  
    await this.intentService.saveAudit(auditEntry);
      

    // Send the response to the user along with the successful response
    response.status(HttpStatus.OK).send(result.response.message);
  }

  private extractEntities(entities: IntentRequestModel):IntentEntities | null {
    const actualEntities = new IntentEntities();    
    if (entities.entities instanceof Array) {
      for (const entity of entities.entities as IntentEntity[]) {
        actualEntities[entity.entity?.toLowerCase()] = entity.value?.toLowerCase();
      }
    } else if (entities.entities) {
      if (entities.entities['entity']) {
        actualEntities[entities.entities['entity']?.toLowerCase()] = entities.entities['value']?.toLowerCase();  
      } else if (Object.getOwnPropertyNames(entities.entities).length > 0) {
        const entityNames = Object.getOwnPropertyNames(entities.entities);
        entityNames.forEach( (it) => {
          actualEntities[it.toLowerCase()] = entities.entities[it]?.toLowerCase(0);
        });
      }      
    } else {
      return null;
    }

    return actualEntities;
  }

  private async getHash(intent: string, locale: string, entities: IntentRequestModel) {
    const key_string = intent + locale + JSON.stringify(entities);
    return crypto.createHash('md5').update(key_string).digest('hex');
  }

  async processIntent(
    handler: IntentHandler,
    metadata: any,
    entities: IntentEntities,
    locale: string
  ): Promise<IntentHandlerResponse> {

    this.logger.debug(`Processing request using ${handler} handler`);
    const actionHandler = this.actionHandlerFactory.getHandler(handler);

    if (!actionHandler) {
      this.logger.error(`Handler ${handler} not found!`);
      return new IntentHandlerResponse({ message: this.getDefaultResponseMessage(locale)});
      
    }

    const result = await actionHandler.handleIntent(metadata, entities);
    if (result.response.next_handler) {
      this.logger.debug(`Response has a chained handler: ${result.response.next_handler}. Will process the intent again`);
      return await this.processIntent(
        result.response.next_handler,
        metadata,
        entities,
        locale
      );
    }
    return result;
  }

  private getDefaultResponseMessage(locale: string): string {    
    if (ALLOWED_LANGUAGES.indexOf(locale) >= 0) {
      return DEFAULT_RESPONSE[locale];
    } else {
      return DEFAULT_RESPONSE[DEFAULT_LOCALE];
    }
  }
}
