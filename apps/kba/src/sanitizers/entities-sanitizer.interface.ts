import { IntentEntities } from "../models/intents.entity";

export interface EntitiesSanitizer {
    sanitize(actualEntities: IntentEntities): IntentEntities;
}