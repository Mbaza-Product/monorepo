import { Logger } from "@nestjs/common";
import { IntentModel, IntentHandler } from "../../../../models/intents.entity";
import { ZammadAnswerModel } from "./zammad.answer-model";
import { ZammadUtils } from "./zammad.utils";

export class ZammadMappingUtils {
    
    private static logger: Logger = new Logger(ZammadMappingUtils.name);

    static answerToIntent(answer: ZammadAnswerModel) {

        //ZammadMappingUtils.logger.debug(`Mapping answer ${JSON.stringify(answer, null, 2)} to Intent!`);

        const answerOptions = ZammadUtils.getOptions(answer.tags);
        return new IntentModel({
            intents: ZammadUtils.getIntents(answer.tags),
            entities: ZammadUtils.getEntities(answer.tags, answer.locale),
            locale: answer.locale,
            ignore_extra_entities:  answerOptions["ignore_extra_entities"] === 'true' || answerOptions["ignore_extra_entities"] === true,
            ignore_extra_rasa_entities:  answerOptions["ignore_extra_rasa_entities"] === 'true' || answerOptions["ignore_extra_rasa_entities"] === true,
            metadata: {
              body: answer.body,
            },
            handler: IntentHandler.KB
          });
    }

    static answersWithIntent(answer: ZammadAnswerModel): boolean {
      return ZammadUtils.getIntents(answer.tags)?.length > 0;
    }
}