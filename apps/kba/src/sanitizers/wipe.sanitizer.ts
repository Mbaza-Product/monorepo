import { IntentEntities } from "../models/intents.entity";
import { EntitiesSanitizer } from "./entities-sanitizer.interface";

export class WipeSanitier implements EntitiesSanitizer {
    sanitize(actualEntities: IntentEntities): IntentEntities {
        return new IntentEntities();
    }

}