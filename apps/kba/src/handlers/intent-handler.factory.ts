import { Injectable } from '@nestjs/common';
import { StaticContentHandler } from './impl/static/static-content.handler';
import { ExternalApiActionHandler } from './impl/external/external-api.action-handler';
import { ZammadActionHandler } from './impl/zammad/zammad.action-handler';
import { IntentHandler } from '../models/intents.entity';
import { IntentHandlerInterface } from './intent-handler.interface';


/**
 * Class factory responsible with creation of IntentHandlerInterface instances, based on the registered IntentHandler type.
 */
@Injectable()
export class IntentHandlerFactory {
  private handlers = new Map<IntentHandler, IntentHandlerInterface>();

  constructor(
    private kbaActionHandler: ZammadActionHandler,
    private externalApiActionHandler: ExternalApiActionHandler,
    private staticHandler: StaticContentHandler,
  ) {

    // Register the actual handlers
    this.handlers.set(IntentHandler.KB, this.kbaActionHandler);
    this.handlers.set(IntentHandler.API, this.externalApiActionHandler);
    this.handlers.set(IntentHandler.STATIC, this.staticHandler);
  }

  /**
   * Retrieve the actual handler
   * @param {IntentHandler} handler Handler instance specific to the requested type
   * @returns {IntentHandlerInterface} the actual IntentHandlerInterface instance
   */

  getHandler(handler: IntentHandler): IntentHandlerInterface {
    return this.handlers.get(handler);
  }
}
