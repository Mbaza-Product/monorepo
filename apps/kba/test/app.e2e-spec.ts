import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PGConnection } from '../src/database/pg.connection';
import { DEFAULT_LOCALE, DEFAULT_RESPONSE } from '../src/intent/intent.languages';

describe('KBAL Intent API', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]      
    }).compile();

    
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    const conn1 = await <Promise<PGConnection>>app.resolve("ZAMMAD_DATABASE");
    await conn1.close();

    const conn2 = await <Promise<PGConnection>>app.resolve("INTENT_DATABASE");
    await conn2.close();

    app.close();
  })

  it('should fail with 404 (NotFound)  when invalid requests are sent', () => {
    return request(app.getHttpServer())
      .post('/invalid-url')
      .expect(HttpStatus.NOT_FOUND)      
  });

  it('should fail with 404 (NotFound) when language is not supported', () => {
    return request(app.getHttpServer())
      .post('/missing/curfew')
      .expect(HttpStatus.NOT_FOUND)
  });

  it('should fail with 404 (NotFound)  when intent does not exist', () => {
    return request(app.getHttpServer())
      .post('/en/invalid-intent')
      .send({
        entities: [
          {entity:"entity_name"},
          {value:"entity_value"},
        ]
      })
      .expect(HttpStatus.NOT_FOUND)
  });

  it('should fail with 406 (NotAcceptable) when invalid request is sent', () => {
    return request(app.getHttpServer())
      .post('/en/curfew')
      .send("some-data")
      .expect(HttpStatus.NOT_ACCEPTABLE)      
  });

  it('should return default message for an unmatched intent with the provided entities', () => {
    return request(app.getHttpServer())
      .post('/en/curfew')      
      .send({
        entities: [
          {entity:"entity_name"},
          {value:"entity_value"},
        ]
      })
      .expect(HttpStatus.NOT_FOUND)
      .expect(DEFAULT_RESPONSE[DEFAULT_LOCALE]);
  });

  it('should return expected response for valid intent with no entities', () => {
    return request(app.getHttpServer())
      .post('/en/curfew')      
      .send({
        entities: [          
        ]
      })
      .expect(HttpStatus.OK);
  });

  it('should return expected response for valid intent with one entity', () => {
    return request(app.getHttpServer())
      .post('/en/fines_penalties')      
      .send({
        entities: [
          {
            entity: "offence",
            value: "offence-curfew"
          }
        ]
      })
      .expect(HttpStatus.OK);
  });

  it('should return expected response for valid intent with multiple entities', () => {
    return request(app.getHttpServer())
      .post('/en/fines_penalties')      
      .send({
        entities: [
          {
            entity: "offence",
            value: "offence-lockdown"
          },
          {
            entity: "location",
            value: "kigali"
          }
        ]
      })
      .expect(HttpStatus.OK);
  });
});
