import { IntentController } from './intent.controller';
import { IntentService } from './intent.service';
import { IntentHandlerFactory } from '../handlers/intent-handler.factory';
import { Cache,caching } from 'cache-manager';
import { IntentHandler, IntentModel } from '../models/intents.entity';
import { ZammadActionHandler } from '../handlers/impl/zammad/zammad.action-handler';
import { StaticContentHandler } from '../handlers/impl/static/static-content.handler';
import { IntentHandlerResponse } from '../handlers/intent-handler.response';
import * as mocks from 'node-mocks-http';
import { Request, Response } from 'express';
import { DEFAULT_LOCALE, DEFAULT_RESPONSE, IntentLanguages, UNSUPPORTED_LANGUAGE_MESSAGE } from './intent.languages';

describe('Intent Controller', () => {
  let controller: IntentController;
  let intentService: IntentService;
  let actionHandlerFactory: IntentHandlerFactory;
  let cacheManager: Cache;
  let zammadContentHandler: ZammadActionHandler;
  let staticContentHandler: StaticContentHandler;

  let request: mocks.MockRequest<Request>;
  let response:  mocks.MockResponse<Response>;

  beforeEach(() => {
    intentService = new IntentService(null);
    zammadContentHandler = new ZammadActionHandler();
    staticContentHandler = new StaticContentHandler();
    actionHandlerFactory = new IntentHandlerFactory(zammadContentHandler, null, staticContentHandler);
    cacheManager = caching({store: 'memory', ttl: 100000 });
    controller = new IntentController(intentService, actionHandlerFactory, cacheManager);
    request = mocks.createRequest()
    response  = mocks.createResponse()
    request.res = response;
  });

  describe('Intent Handling', () => {
    describe('Default Flows', () => {      
        it('should return default message when intent does not exist in the database', async () => {
            jest.spyOn(intentService, "getIntent").mockImplementation( () => null);
            await controller.handleIntent('symptoms', DEFAULT_LOCALE, { entities: [] }, response)
            expect(response._getData())
                .toEqual(DEFAULT_RESPONSE[DEFAULT_LOCALE]);
        });

        it('should return default message when there is no valid handler to be used', async () => {
            const intentResponse: IntentModel = new IntentModel({ 
                intents: ["symptoms"], 
                locale: DEFAULT_LOCALE,
                handler: <IntentHandler>"INVALID",
                metadata: { 
                    body: "Matching answer" 
                } 
            });

            jest.spyOn(intentService, "getIntent").mockImplementation( () => Promise.resolve(intentResponse));
            await controller.handleIntent('symptoms', DEFAULT_LOCALE, { entities: [] }, response);
            expect(response._getData())
                .toEqual(DEFAULT_RESPONSE[DEFAULT_LOCALE]);
        });

        it('should return localized default message when intent does not exist in the database', async () => {
            jest.spyOn(intentService, "getIntent").mockImplementation( () => null);
            await controller.handleIntent('symptoms', IntentLanguages.FRENCH, { entities: [] }, response);
            expect(response._getData())
                .toEqual(DEFAULT_RESPONSE[IntentLanguages.FRENCH]);
        });

        it('should use the default language for the default message when it\' not properly provided', async () => {
            jest.spyOn(intentService, "getIntent").mockImplementation( () => null);
            await controller.handleIntent('symptoms', 'gr', { entities: [] }, response)
            expect(response._getData())
                .toEqual(UNSUPPORTED_LANGUAGE_MESSAGE);
        });

        it('should be able to handle single entity format', async () => {
            jest.spyOn(intentService, "getIntent").mockImplementation( () => null);
            await controller.handleIntent('symptoms', DEFAULT_LOCALE, { entities: {
                entity: "entity", value: "value"
            } }, response);
            expect(response._getData())
                .toEqual(DEFAULT_RESPONSE[DEFAULT_LOCALE]);
        });

        it('should return matching intent with no entities', async () => {

            // As the matching is done by the IntentService and not by the controller,
            // the purpose of this test is strictly to ensure the format of the input, 
            // and its variation, is not impacting functionality

            const intentResponse: IntentModel = new IntentModel({ 
                intents: ["symptoms"], 
                locale: DEFAULT_LOCALE,
                metadata: { 
                    body: "Matching answer" 
                } 
            });
            jest.spyOn(intentService, "getIntent").mockImplementation( () => Promise.resolve(intentResponse));
            await controller.handleIntent('symptoms', DEFAULT_LOCALE, { entities: [] }, response);
            expect(response._getData())
                .toEqual(intentResponse.metadata[StaticContentHandler.BODY_FIELD]);
        });

        it('should return matching intent with single entity', async () => {

            // As the matching is done by the IntentService and not by the controller,
            // the purpose of this test is strictly to ensure the format of the input, 
            // and its variation, is not impacting functionality

            const intentResponse: IntentModel = new IntentModel({ 
                intents: ["symptoms"], 
                locale: DEFAULT_LOCALE,
                entities: {
                    'single_entity': 'single_value',
                }, metadata: { 
                    body: "Matching answer" 
                } 
            });        
            jest.spyOn(intentService, "getIntent").mockImplementation( () => Promise.resolve(intentResponse));
            await controller.handleIntent('symptoms', DEFAULT_LOCALE, { entities: [{ entity:"single_entity", value: "single_value" }] }, response);
            expect(response._getData())
                .toEqual(intentResponse.metadata[StaticContentHandler.BODY_FIELD]);
        });

        it('should return matching intent with multiple entities', async () => {

            // As the matching is done by the IntentService and not by the controller,
            // the purpose of this test is strictly to ensure the format of the input, 
            // and its variation, is not impacting functionality

            const intentResponse: IntentModel = new IntentModel({ 
                intents: ["intent"], 
                locale: DEFAULT_LOCALE,
                entities: {
                    'first_entity': 'first_value',
                    '2nd_entity': '2nd_value',            
                }, metadata: { 
                    body: "Matching answer" 
                } 
            });        
            jest.spyOn(intentService, "getIntent").mockImplementation( () => Promise.resolve(intentResponse));
            await controller.handleIntent('symptoms', DEFAULT_LOCALE, { entities: [{ entity:"location", value: "rwanda" }] }, response);
            expect(response._getData())
                .toEqual(intentResponse.metadata[StaticContentHandler.BODY_FIELD]);
        });      
    });

    describe("Caching behaviour", () => {
        it('should return cached intent on 2nd request with the same intent', async () => {
            const intentResponse: IntentModel = new IntentModel({ 
                intents: ["symptoms"], 
                locale: "en",
                metadata: { 
                    body: "Matching answer" 
                } 
            });
            const getIntentMock = jest.spyOn(intentService, "getIntent").mockImplementation( () => Promise.resolve(intentResponse));                
            await controller.handleIntent('symptoms', DEFAULT_LOCALE, { entities: [] }, response);
            await controller.handleIntent('symptoms', DEFAULT_LOCALE, { entities: [] }, response);
            expect(getIntentMock).toBeCalledTimes(1);
        });

        it('should not use cached responses for different intents', async () => {
            const intentResponse: IntentModel = new IntentModel({ 
                intents: ["symptoms"], 
                locale: "en",
                metadata: { 
                    body: "Matching answer" 
                } 
            });
            const getIntentMock = jest.spyOn(intentService, "getIntent").mockImplementation( () => Promise.resolve(intentResponse));                
            await controller.handleIntent('symptoms1', DEFAULT_LOCALE, { entities: [] }, response);
            await controller.handleIntent('symptoms2', DEFAULT_LOCALE, { entities: [] }, response);
            expect(getIntentMock).toBeCalledTimes(2);
        });

        it('should not use cached responses for different locales', async () => {
            const intentResponse: IntentModel = new IntentModel({ 
                intents: ["symptoms"], 
                locale: "en",
                metadata: { 
                    body: "Matching answer" 
                } 
            });
            const getIntentMock = jest.spyOn(intentService, "getIntent").mockImplementation( () => Promise.resolve(intentResponse));                
            await controller.handleIntent('symptoms', DEFAULT_LOCALE, { entities: [] }, response);
            await controller.handleIntent('symptoms', 'fr', { entities: [] }, response);
            expect(getIntentMock).toBeCalledTimes(2);
        });

        it('should not use cached responses for different entities', async () => {
            const intentResponse: IntentModel = new IntentModel({ 
                intents: ["symptoms"], 
                locale: "en",
                metadata: { 
                    body: "Matching answer" 
                } 
            });
            const getIntentMock = jest.spyOn(intentService, "getIntent").mockImplementation( () => Promise.resolve(intentResponse));                
            await controller.handleIntent('symptoms', DEFAULT_LOCALE, { entities: [{ entity:"single_entity", value: "single_value" }] }, response);
            await controller.handleIntent('symptoms', DEFAULT_LOCALE, { entities: [{ entity:"single_entity", value: "another_value" }] }, response);
            expect(getIntentMock).toBeCalledTimes(2);
        });
    });

    describe("Handlers chaining", () => {
        it('should be able to handle chained handlers', async () => {
            const intentResponse: IntentModel = new IntentModel({ 
                intents: ["symptoms"], 
                //locale: "en", // When not provided, the default locale will be used
                entities: {
                    'single_entity': 'single_value',
                }, metadata: { 
                    body: "Matching answer" 
                } 
            });      

            const chainedIntentResponse: IntentHandlerResponse = new IntentHandlerResponse({next_handler:IntentHandler.STATIC});

            jest.spyOn(zammadContentHandler, "handleIntent").mockImplementation( () => Promise.resolve(chainedIntentResponse));
            jest.spyOn(intentService, "getIntent").mockImplementation( () => Promise.resolve(intentResponse));
            await controller.handleIntent('symptoms', DEFAULT_LOCALE, { entities: {
                entity: "entity", value: "value"
            } }, response);
            expect(response._getData())
                .toEqual(intentResponse.metadata[StaticContentHandler.BODY_FIELD]);
        });
    })
  });
});