import { IntentHandler } from '../models/intents.entity';

/**
 * Contains the response of the IntentHandler processing of a given intent / request.
 * The response can contain either the message (the actual content that the KBAL will send to the User)
 * or the type of another handler (delegated) that will attempt to process the intent.
 */
export class IntentHandlerResponse {

  /**
   * @constructor
   * @param response The actual response
   */
  constructor(
    public response: {
      message?: string;
      next_handler?: IntentHandler;
    },
  ) { }
}
