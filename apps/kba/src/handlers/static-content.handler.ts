import { IntentEntities } from '../models/intents.entity';
import { ActionHandler } from './action-handler.interface';
import { HandlerResponse } from './handler-response';

export class StaticContentHandler implements ActionHandler {
  async handleIntent(
    handling_metadata: string,
    actualEntities: IntentEntities,
  ): Promise<HandlerResponse> {
    return new HandlerResponse({ message: handling_metadata?.['content'] });
  }
}
