import { IntentHandler } from '../models/intents.entity';

export class HandlerResponse {
  constructor(
    public response: {
      message?: string;
      next_handler?: IntentHandler;
    },
  ) { }
}
