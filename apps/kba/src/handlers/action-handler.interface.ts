import { IntentEntities } from '../models/intents.entity';
import { HandlerResponse } from './handler-response';

export interface ActionHandler {
  handleIntent(
    handling_metadata: unknown,
    actualEntities: IntentEntities,
  ): Promise<HandlerResponse>;
}
