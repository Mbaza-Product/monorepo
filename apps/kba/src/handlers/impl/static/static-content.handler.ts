import { IntentEntities } from '../../../models/intents.entity';
import { IntentHandlerInterface } from '../../intent-handler.interface';
import { IntentHandlerResponse } from '../../intent-handler.response';

/**
 * ActionHandler implementation that provides access to static content (stored in database).
 * The implementation is fairly basic as it just returns the content stored in the body metadata.
 */
export class StaticContentHandler implements IntentHandlerInterface {

  public static readonly BODY_FIELD = 'body';

  /**
   * Extracts the body metadata and returns it to the user
   * 
   * @param {unknown} handling_metadata Metadata associated with the intent
   * @param {IntentEntities} actualEntities Map of entities received in the user's request
   * @returns {Promise<IntentHandlerResponse>} The processing response
   */
  async handleIntent(
    handling_metadata: string,
    actualEntities: IntentEntities,
  ): Promise<IntentHandlerResponse> {
    return new IntentHandlerResponse({ message: handling_metadata?.[StaticContentHandler.BODY_FIELD] });
  }
}
