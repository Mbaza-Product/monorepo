import { IntentEntities } from '../models/intents.entity';
import { IntentHandlerResponse as IntentHandlerResponse } from './intent-handler.response';

/**
 * Standard Intent Handler Interface. Provides a simple way to handle intents with the possibility 
 * to return a dynamic response ( by replacing some entities in the actual content), a static 
 * response or to pass the handling responsibility to another registered handler.
 */
export interface IntentHandlerInterface {
  /**
   * Handles the actual intent along with its corresponding entities.
   * @param {unknown} handling_metadata An object (with key/value mapped content) describing the metadata specific to the handler.
   * @param {IntentEntities} actualEntities The actual entities as a key/value map
   * @returns {Promise<IntentHandlerResponse>} The result of the intent handling activity (can contain a message to be passed 
   * on to the user or the next handler to process the request)
   */
  handleIntent(
    handling_metadata: unknown,
    actualEntities: IntentEntities,
  ): Promise<IntentHandlerResponse>;
}
