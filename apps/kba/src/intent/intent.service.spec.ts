import { IntentModel } from '../models/intents.entity';
import { Repository } from 'typeorm';
import { IntentService } from './intent.service';

export class MockRepository extends Repository<IntentModel> {

}

describe('Intent Service', () => {
  let intentService: IntentService;
  let repository: MockRepository;
  
  beforeEach(() => {        
    repository = new MockRepository();
    intentService = new IntentService(null);
    jest.spyOn(intentService, "getRepository").mockImplementation( () => repository); 
  });

  
  describe('Default Flows', () => {    
    it('Should return the exactly matched intent when found', async () => {            
      const expectedResponse: IntentModel = new IntentModel({ 
          intents: ["symptoms"], 
          //locale: "en", // When not provided, the default locale will be used
          entities: {
              'single_entity': 'single_value',
          }, metadata: { 
              body: "Matching answer" 
          } 
      });   
      
      const findOne = jest.spyOn(repository, "findOne").mockImplementation( () => Promise.resolve(expectedResponse)); 
      const findQuery = jest.spyOn(repository, "find");
      
      const actualResponse = await intentService.getIntent("symptoms", {}, "en");
            
      expect(findQuery).toBeCalledTimes(0);
      expect(findOne).toBeCalledTimes(1);

      expect(actualResponse).toEqual(expectedResponse);
    });

    it('Should return no intent when neither partial nor exact matches are found', async () => {            
      const findOne = jest.spyOn(repository, "findOne").mockImplementation( () => null); 
      const findQuery = jest.spyOn(repository, "find").mockImplementation( () => null); 
      
      const actualResponse = await intentService.getIntent("symptoms", {}, "en");
            
      expect(findQuery).toBeCalledTimes(1);
      expect(findOne).toBeCalledTimes(1);

      expect(actualResponse).toEqual(null);
    });

    it('Should return no intent when the partial matches don\'t have enough entities', async () => {            
      const partialIntentMatch: IntentModel = new IntentModel({ 
          intents: ["symptoms"], 
          //locale: "en", // When not provided, the default locale will be used
          entities: {
              'single_entity': 'single_value',
          }, metadata: { 
              body: "Matching answer" 
          } 
      });   
      
      const findOne = jest.spyOn(repository, "findOne").mockImplementation( () => null); 
      const findQuery = jest.spyOn(repository, "find").mockImplementation( () => Promise.resolve([partialIntentMatch])); 
      
      const actualResponse = await intentService.getIntent("symptoms", { "another_entity": "another_value"}, "en");
            
      expect(findQuery).toBeCalledTimes(1);
      expect(findOne).toBeCalledTimes(1);

      expect(actualResponse).toEqual(null);
    });

    it('Should return the best matched intent when some entities can be ignored', async () => {            
      const firstIntent: IntentModel = new IntentModel({ 
          intents: ["symptoms"],           
          entities: {
              'single_entity': 'single_value',
              'additional_entity': 'additional_value',
              'extra_entity': 'extra_value',
          }, metadata: { 
              body: "first answer" 
          } 
      });   
      
      const secondIntent: IntentModel = new IntentModel({ 
        intents: ["symptoms"],           
        entities: {
            'another_entity': 'another_value',
            'additional_entity': 'additional_value',
        }, metadata: { 
            body: "second answer" 
        } 
      });   
  
      const findOne = jest.spyOn(repository, "findOne").mockImplementation( () => null); 
      const findQuery = jest.spyOn(repository, "find").mockImplementation( () => Promise.resolve([firstIntent, secondIntent])); 
      const actualResponse = await intentService.getIntent("symptoms", {'single_entity' : 'single_value'}, "en");      
      expect(findOne).toBeCalledTimes(1);
      expect(findQuery).toBeCalledTimes(1);
      expect(actualResponse).toBe(firstIntent);
    });

    it('Should return the best matched intent when some entities use wildcards', async () => {            
      const firstIntent: IntentModel = new IntentModel({ 
          intents: ["symptoms"],                     
          entities: {
              'single_entity': '*',
              'additional_entity': '*',
              'extra_entity': 'extra_value',
          }, metadata: { 
              body: "first answer" 
          } 
      });   
      
      const secondIntent: IntentModel = new IntentModel({ 
        intents: ["symptoms"],           
        entities: {
            'another_entity': 'another_value',
            'additional_entity': 'additional_value',
        }, metadata: { 
            body: "second answer" 
        } 
      });   

      const findOne = jest.spyOn(repository, "findOne").mockImplementation( () => null); 
      const findQuery = jest.spyOn(repository, "find").mockImplementation( () => Promise.resolve([firstIntent, secondIntent])); 
      
      const actualResponse = await intentService.getIntent("symptoms", {'single_entity' : 'single_value'}, "en");

      expect(findOne).toBeCalledTimes(1);
      expect(findQuery).toBeCalledTimes(1);
      expect(actualResponse).toBe(firstIntent);
    });

    it('Should return the best matched intent independent of the records order in DB', async () => {            
      const firstIntent: IntentModel = new IntentModel({ 
        intents: ["symptoms"],           
        entities: {
            'another_entity': 'another_value',
            'additional_entity': 'additional_value',
        }, metadata: { 
            body: "first answer" 
        } 
      });   
      
      const secondIntent: IntentModel = new IntentModel({ 
          intents: ["symptoms"],           
          entities: {
              'single_entity': '*',
              'additional_entity': '*',
              'extra_entity': 'extra_value',
          }, metadata: { 
              body: "second answer" 
          } 
      });   
      
      

      const findOne = jest.spyOn(repository, "findOne").mockImplementation( () => null); 
      const findQuery = jest.spyOn(repository, "find").mockImplementation( () => Promise.resolve([firstIntent, secondIntent])); 
      
      const actualResponse = await intentService.getIntent("symptoms", {'single_entity' : 'single_value'}, "en");

      expect(findOne).toBeCalledTimes(1);
      expect(findQuery).toBeCalledTimes(1);
      expect(actualResponse).toBe(secondIntent);
    });

    it('Should return one matched intent when multiple partial candidates with the same number of matches exist', async () => {            
      const firstIntent: IntentModel = new IntentModel({ 
        intents: ["symptoms"],           
        entities: {
            'another_entity': 'another_value',
            'single_entity': 'single_value',
        }, metadata: { 
            body: "first answer" 
        } 
      });   
      
      const secondIntent: IntentModel = new IntentModel({ 
          intents: ["symptoms"],           
          entities: {
            'another_entity': 'another_value',
            'single_entity': 'single_value',
          }, metadata: { 
              body: "second answer" 
          } 
      });   
      
      

      const findOne = jest.spyOn(repository, "findOne").mockImplementation( () => null); 
      const findQuery = jest.spyOn(repository, "find").mockImplementation( () => Promise.resolve([firstIntent, secondIntent])); 
      
      const actualResponse = await intentService.getIntent("symptoms", {'single_entity' : 'single_value'}, "en");

      expect(findOne).toBeCalledTimes(1);
      expect(findQuery).toBeCalledTimes(1);
      expect(actualResponse).not.toBe(null);
    });
  });
});