import { IntentEntities } from '../models/intents.entity';
import { ActionHandler } from './action-handler.interface';
import { HandlerResponse } from './handler-response';
import * as cheerio from 'cheerio';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ExternalApiActionHandler implements ActionHandler {
  private logger: Logger = new Logger(ExternalApiActionHandler.name);

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) { }
  async handleIntent(
    handling_metadata: string,
    actualEntities: IntentEntities,
  ): Promise<HandlerResponse> {
    let api_url = 'https://www.worldometers.info/coronavirus/weekly-trends/';
    if (actualEntities['GPE'] && actualEntities['GPE'] !== 'world') {
      api_url = `https://www.worldometers.info/coronavirus/country/${actualEntities['GPE']}`;
    }

    const api_response = await lastValueFrom(this.httpService.get(api_url));
    const clean_message = this.extractData(api_response.data);

    this.logger.debug(
      `message:ExternalAPIActionHandler, Entities:${actualEntities},URL:${api_url}`,
    );

    return new HandlerResponse({ message: clean_message });
  }

  private extractData(response: string): string {
    try {
      const $ = cheerio.load(response);
      const result = $('#maincounter-wrap').text();
      return result;
    } catch (e) {      
      return 'Sorry we do not have this information at the moment';
    }
  }
}
