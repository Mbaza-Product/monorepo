import { IntentHandler, IntentModel } from "../../../../models/intents.entity";
import { IntentService } from "../../../../intent/intent.service";
import { ZammadAnswerModel } from "./zammad.answer-model";
import { ZammadCategoryModel } from "./zammad.category-model";
import { ZammadService } from "./zammad.service";
import { ZammadSynchronizationJob } from "./zammad.sync-job";

describe('Synchronisation Job', () => {

  let zammadService: ZammadService;
  let intentService: IntentService;
  let synchronisationJob: ZammadSynchronizationJob;
  let categories: ZammadCategoryModel[];      

  beforeEach(() => {
    zammadService = new ZammadService(null);
    intentService = new IntentService(null);   
    synchronisationJob = new ZammadSynchronizationJob(zammadService, intentService); 


    //// LEGEND:
    ////
    ////      ->      : child category
    ////      *>      : child answer
    ////      intent  : intent assigned directly
    ////      entity  : entity assigned directly      
    ////      ^intent : inherited intent from the Default answer
    ////      ^entity : inherited entity from the Default answer
    ////
    //// SAMPLE HIERARCHY:
    //// 
    ////    ROOT -> CHILD 1 -> CHILD 1.1
    ////                        *> Answer 2 (intent_2) 
    ////                    -> CHILD 1.2     
    ////                        *> DEFAULT (entity1, intent_x)
    ////                        -> CHILD 1.2.1
    ////                           *> Answer 1 (intent_1, ^entity1, ^intent_x)                                
    ////                        -> CHILD 1.2.2
    ////                           *> Answer 3 (intent_3, entity_3, ^entity1, ^intent_x)                                
    ////                    -> CHILD 1.3
    ////                        *> Answer 4 (intent_4)                  

    categories = [];

    const defaultAnswer = new ZammadAnswerModel(1, 1, 3, "default", "The default answer", "en", ["entity:entity_1:entity_1_value", "int:intent_x"]);
    const childAnswer1 = new ZammadAnswerModel(2, 2, 7, "Anwer 1", "The First Answer", "en", ["intent:intent_1"]);
    const childAnswer2 = new ZammadAnswerModel(3, 3, 5, "Anwer 2", "The 2nd Answer", "en", ["intent:intent_2"]);
    const childAnswer3 = new ZammadAnswerModel(4, 4, 6, "Anwer 3", "The 3rd Answer", "en", ["intent:intent_3", "entity:entity_3:entity_val"]);
    const childAnswer4 = new ZammadAnswerModel(5, 5, 3, "Anwer 4", "The 4th Answer", "en", ["intent:intent_4"]);
    const childCategory121 = new ZammadCategoryModel(7, 4, "CHILD 1.2.1", "en", [], [childAnswer1])
    const childCategory122 = new ZammadCategoryModel(6, 4, "CHILD 1.2.2", "en", [], [childAnswer3])
    const childCategory11 = new ZammadCategoryModel(5, 2, "CHILD 1.1", "en", [], [childAnswer2])
    const childCategory12 = new ZammadCategoryModel(4, 2, "CHILD 1.2", "en", [childCategory121, childCategory122], [defaultAnswer])
    const childCategory13 = new ZammadCategoryModel(3, 2, "CHILD 1.3", "en", [], [childAnswer4])
    const childCategory1 = new ZammadCategoryModel(2, 1, "CHILD 1", "en", [childCategory11, childCategory12, childCategory13], [])
    const rootCategory = new ZammadCategoryModel(1, null, "ROOT", "en", [childCategory1], [])
    categories.push(rootCategory);

  });

  describe('Processing', () => {
 
    it('should only detect answers completelly defined', async () => {
      
      jest.spyOn(zammadService, "getHierarchy").mockImplementation( () => Promise.resolve(categories));
      jest.spyOn(intentService, "clearIntents").mockImplementation();
      const saveIntentMock = jest.spyOn(intentService, "saveIntent").mockImplementation();

      await synchronisationJob.synchronizeContent();
      expect(saveIntentMock).toBeCalledTimes(4);
      expect(saveIntentMock).toHaveBeenNthCalledWith(1, <IntentModel>{handler: IntentHandler.KB, entities: { }, intents: ["intent_2"], locale: "en", metadata: {body: "The 2nd Answer"},  "ignore_extra_entities": false, "ignore_extra_rasa_entities": false});      
      expect(saveIntentMock).toHaveBeenNthCalledWith(2, <IntentModel>{handler: IntentHandler.KB, entities: { entity_1: "entity_1_value"}, intents: ["intent_1", "intent_x"], locale: "en", metadata: {body: "The First Answer"},  "ignore_extra_entities": false, "ignore_extra_rasa_entities": false});      
      expect(saveIntentMock).toHaveBeenNthCalledWith(3, <IntentModel>{handler: IntentHandler.KB, entities: { entity_3: "entity_val", entity_1: "entity_1_value",}, intents: ["intent_3", "intent_x"], locale: "en", metadata: {body: "The 3rd Answer"},  "ignore_extra_entities": false, "ignore_extra_rasa_entities": false}); 
      expect(saveIntentMock).toHaveBeenNthCalledWith(4, <IntentModel>{handler: IntentHandler.KB, entities: { }, intents: ["intent_4"], locale: "en", metadata: {body: "The 4th Answer"},  "ignore_extra_entities": false, "ignore_extra_rasa_entities": false});      
    });

    it('should only run one sync at a time', async () => {
      jest.spyOn(zammadService, "getHierarchy").mockImplementation( () => Promise.resolve(categories));
      jest.spyOn(intentService, "clearIntents").mockImplementation();
      const saveIntentMock = jest.spyOn(intentService, "saveIntent").mockImplementation();
      
      const firstCall = synchronisationJob.synchronizeContent(); 
      const secondCall = synchronisationJob.synchronizeContent();      
      await Promise.all([firstCall, secondCall]);

      expect(saveIntentMock).toBeCalledTimes(4);      
    });

  });
});