import { ZammadAnswerModel } from "./zammad.answer-model";
import { ZammadCategoryModel } from "./zammad.category-model";
import { ZammadUtils } from "./zammad.utils";

describe('Zammad Utils', () => {

  beforeEach(() => {
  });

  describe('Option Tags Processing', () => {
    
    it('should extract no options when no tags are having the right prefix', async () => {
      const tags = ["tag1", "tag2"];
      const options = ZammadUtils.getOptions(tags);

      expect(options).not.toBeNull();
      expect(Object.getOwnPropertyNames(options)).toHaveLength(0);
    });


    it('should extract options with any of the prefixes', async () => {
      const tags = ["opt:name1:value1", "opt:name2:value2"];
      const options = ZammadUtils.getOptions(tags);

      expect(options).not.toBeNull();
      expect(Object.getOwnPropertyNames(options)).toHaveLength(2);

      expect(options).toEqual( {name1: "value1", name2: "value2"});
    });

    it('should extract only valid/completely defined options', async () => {
      const tags = ["opt:name1", "opt", "opt:name:value", "opt:", "opt:name2:"];
      const options = ZammadUtils.getOptions(tags);

      expect(options).not.toBeNull();
      expect(Object.getOwnPropertyNames(options)).toHaveLength(2);

      expect(options).toEqual( {name: "value", name1: true});
    });

  });

  describe('Entity Tags Processing', () => {
    
    it('should extract no entities when no tags are having the right prefix', async () => {
      const tags = ["tag1", "tag2"];
      const entities = ZammadUtils.getEntities(tags);

      expect(entities).not.toBeNull();
      expect(Object.getOwnPropertyNames(entities)).toHaveLength(0);
    });


    it('should extract entities with any of the prefixes', async () => {
      const tags = ["entity:name1:value1", "ent:name2:value2"];
      const entities = ZammadUtils.getEntities(tags);

      expect(entities).not.toBeNull();
      expect(Object.getOwnPropertyNames(entities)).toHaveLength(2);

      expect(entities).toEqual( {name1: "value1", name2: "value2"});
    });

    it('should extract only valid/completely defined entities', async () => {
      const tags = ["entity:name1", "ent", "ent:name:value", "ent:", "entity:name1:"];
      const entities = ZammadUtils.getEntities(tags);

      expect(entities).not.toBeNull();
      expect(Object.getOwnPropertyNames(entities)).toHaveLength(1);

      expect(entities).toEqual( {name: "value"});
    });

  });

  describe('Intent Tags Processing', () => {
    
    it('should extract no intents when no tags are having the right prefix', async () => {
      const tags = ["tag1", "tag2"];
      const intents = ZammadUtils.getIntents(tags);

      expect(intents).not.toBeNull();
      expect(intents).toHaveLength(0);
    });

    it('should extract intents with any of the prefixes', async () => {
      const tags = ["intent:intent_1", "int:intent_2"];
      const intents = ZammadUtils.getIntents(tags);

      expect(intents).not.toBeNull();
      expect(intents).toHaveLength(2);

      expect(intents).toEqual(["intent_1", "intent_2"]);
    });

    it('should extract only valid/completely defined intents', async () => {
      const tags = ["intent:", "int:", "intent:intent_name"];
      const intents = ZammadUtils.getIntents(tags);

      expect(intents).not.toBeNull();
      expect(intents).toHaveLength(1);

      expect(intents).toEqual(["intent_name"]);
    });

  });

  describe('Hierarchy Processing', () => {
    it('should not have any errors when processing an empty database', async () => {
      const answers = ZammadUtils.flattenHierarchy([]);

      expect(answers).not.toBeNull();
      expect(answers).toHaveLength(0);
    });

    it('should process a single level category with null child categories and answers', async () => {
      const categories: ZammadCategoryModel[] = [];
      categories.push(new ZammadCategoryModel(1, null, "ROOT", "en", null, null));

      const answers = ZammadUtils.flattenHierarchy(categories);

      expect(answers).not.toBeNull();
      expect(answers).toHaveLength(0);
    });

    it('should process a single level category with empty child categories or answers', async () => {
      const categories: ZammadCategoryModel[] = [];
      categories.push(new ZammadCategoryModel(1, null, "ROOT", "en", [], []));

      const answers = ZammadUtils.flattenHierarchy(categories);

      expect(answers).not.toBeNull();
      expect(answers).toHaveLength(0);
    });

    it('should process single level hierarchy', async () => {
      const childAnswer = new ZammadAnswerModel(1, 1, 2, "Anwer", "The Answer", "en", []);
      const rootCategory = new ZammadCategoryModel(1, null, "ROOT", "en", [], [childAnswer])            
      const answers = ZammadUtils.flattenHierarchy([rootCategory]);

      expect(answers).not.toBeNull();
      expect(answers).toHaveLength(1);
    });

    it('should process parent-child hierarchy', async () => {
      const categories: ZammadCategoryModel[] = [];      
      const childAnswer = new ZammadAnswerModel(1, 1, 2, "Anwer", "The Answer", "en");
      const childCategory = new ZammadCategoryModel(2, 1, "CHILD", "en", [], [childAnswer])
      const rootCategory = new ZammadCategoryModel(1, null, "ROOT", "en", [childCategory], [])
      
      categories.push(rootCategory);

      const answers = ZammadUtils.flattenHierarchy(categories);

      expect(answers).not.toBeNull();
      expect(answers).toHaveLength(1);
    });

    it('should process multi-level hierarchy', async () => {
      const categories: ZammadCategoryModel[] = [];      
      const childAnswer1 = new ZammadAnswerModel(1, 1,  5, "Anwer 1", "The First Answer", "en", []);
      const childAnswer2 = new ZammadAnswerModel(2, 2,  4, "Anwer 2", "The 2nd Answer ", "en", []);
      const childCategory121 = new ZammadCategoryModel(5, 3, "CHILD 1.2.1", "en", [], [childAnswer1])      
      const childCategory11 = new ZammadCategoryModel(4, 2, "CHILD 1.1", "en", [], [childAnswer2])
      const childCategory12 = new ZammadCategoryModel(3, 2, "CHILD 1.2", "en", [childCategory121], [])
      const childCategory1 = new ZammadCategoryModel(2, 1, "CHILD 1", "en", [childCategory12, childCategory11], [])
      const rootCategory = new ZammadCategoryModel(1, null, "ROOT", "en", [childCategory1], [])
      
      categories.push(rootCategory);

      const answers = ZammadUtils.flattenHierarchy(categories);

      expect(answers).not.toBeNull();
      expect(answers).toHaveLength(2);
    });
  });

  describe('Default Tags Expansion', () => {
    
    it('should use the tags from the default Answer', async () => {
      const categories: ZammadCategoryModel[] = [];      
      const defaultAnswer = new ZammadAnswerModel(1, 1, 5, "default", "The default answer", "en", ["entity:entity_1:entity_1_value"]);
      const childAnswer1 = new ZammadAnswerModel(2, 1, 5, "Anwer 1", "The First Answer", "en", []);
      const childAnswer2 = new ZammadAnswerModel(3, 2, 4, "Anwer 2", "The 2nd Answer ", "en", []);
      const childCategory121 = new ZammadCategoryModel(5, 3, "CHILD 1.2.1", "en", [], [childAnswer1])      
      const childCategory11 = new ZammadCategoryModel(4, 2, "CHILD 1.1", "en", [], [childAnswer2])
      const childCategory12 = new ZammadCategoryModel(3, 2, "CHILD 1.2", "en", [childCategory121], [])
      const childCategory1 = new ZammadCategoryModel(2, 1, "CHILD 1", "en", [childCategory12, childCategory11], [defaultAnswer])
      const rootCategory = new ZammadCategoryModel(1, null, "ROOT", "en", [childCategory1], [])
      
      categories.push(rootCategory);

      ZammadUtils.expandDefaultTags(categories);
      const answers = ZammadUtils.flattenHierarchy(categories);
    
      expect(answers).not.toBeNull();
      expect(answers).toHaveLength(2);
    });

    it('should handle complex hierarchies with default tags', () => {
      const categories: ZammadCategoryModel[] = [];      
      const defaultAnswer = new ZammadAnswerModel(1, 1, 3, "default", "The default answer", "en", ["entity:entity_1:entity_1_value", "int:intent_x"]);
      const childAnswer1 = new ZammadAnswerModel(2, 1, 5, "Anwer 1", "The First Answer", "en", ["intent:intent_1"]);
      const childAnswer2 = new ZammadAnswerModel(3, 2, 4, "Anwer 2", "The 2nd Answer", "en", ["intent:intent_2"]);
      const childAnswer3 = new ZammadAnswerModel(4, 2, 6, "Anwer 3", "The 3rd Answer", "en", ["intent:intent_3", "entity:entity_3:entity_val"]);
      const childAnswer4 = new ZammadAnswerModel(5, 2, 6, "Anwer 4", "The 4th Answer", "en", ["intent:intent_4"]);
      const childCategory121 = new ZammadCategoryModel(7, 4, "CHILD 1.2.1", "en", [], [childAnswer1])
      const childCategory122 = new ZammadCategoryModel(6, 4, "CHILD 1.2.2", "en", [], [childAnswer3])
      const childCategory11 = new ZammadCategoryModel(5, 2, "CHILD 1.1", "en", [], [childAnswer2])
      const childCategory12 = new ZammadCategoryModel(4, 2, "CHILD 1.2", "en", [childCategory121, childCategory122], [defaultAnswer])
      const childCategory13 = new ZammadCategoryModel(3, 2, "CHILD 1.3", "en", [], [childAnswer4])
      const childCategory1 = new ZammadCategoryModel(2, 1, "CHILD 1", "en", [childCategory11, childCategory12, childCategory13], [])
      const rootCategory = new ZammadCategoryModel(1, null, "ROOT", "en", [childCategory1], [])

      categories.push(rootCategory);

      ZammadUtils.expandDefaultTags(categories);
      const answers = ZammadUtils.flattenHierarchy(categories);
      
      expect(answers).not.toBeNull();
      expect(answers[0].tags).toEqual(["intent:intent_2"]);
      expect(answers[1].tags).toEqual(['intent:intent_1', 'entity:entity_1:entity_1_value', 'int:intent_x']);
      expect(answers[2].tags).toEqual(['intent:intent_3', 'entity:entity_3:entity_val', 'entity:entity_1:entity_1_value', 'int:intent_x']);
      expect(answers[3].tags).toEqual(['intent:intent_4']);      
    })
  });
});