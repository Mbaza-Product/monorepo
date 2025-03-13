import { Injectable } from '@nestjs/common';
import { IntentHandler } from '../models/intents.entity';
import { ActionHandler } from './action-handler.interface';
import { StaticContentHandler } from './static-content.handler';
import { ExternalApiActionHandler } from './external-api.action-handler';
import { ZammadActionHandler as KBActionHandler } from './zammad.action-handler';

@Injectable()
export class ActionHandlerFactory {
  private handlers = new Map<IntentHandler, ActionHandler>();

  constructor(
    private kbaActionHandler: KBActionHandler,
    private externalApiActionHandler: ExternalApiActionHandler,
  ) {
    this.handlers.set(IntentHandler.KB, this.kbaActionHandler);
    this.handlers.set(IntentHandler.API, this.externalApiActionHandler);
    this.handlers.set(IntentHandler.STATIC, new StaticContentHandler());
  }

  getHandler(handling_strategy: IntentHandler): ActionHandler {
    return this.handlers.get(handling_strategy);
  }
}
