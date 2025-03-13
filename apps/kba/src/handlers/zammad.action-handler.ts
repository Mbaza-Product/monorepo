import { lastValueFrom, Observable } from 'rxjs';
import { IntentEntities } from '../models/intents.entity';
import { ActionHandler } from './action-handler.interface';
import { HandlerResponse } from './handler-response';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ZammadActionHandler implements ActionHandler {

  private logger: Logger = new Logger(ZammadActionHandler.name);
  
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) { }

  private readonly BEARER_TOKEN_HEADER = 'ZAMMAD_BEARER_TOKEN';
  private readonly BASE_URL = 'ZAMMAD_BASE_URL';

  async handleIntent(
    handling_metadata: unknown,
    actualEntities: IntentEntities,
  ): Promise<HandlerResponse> {
    const params = handling_metadata;
    const kb_url = params['url'];
    const zammad_response = lastValueFrom(this.zammadApi(kb_url));
    return new HandlerResponse({
      message: await this.cleanResponse(zammad_response, kb_url),
    });
  }

  private zammadApi(entity_url): Observable<AxiosResponse<any>> {
    const { zammad_base_url, bearer_token } = this.getAuthCredentials();
    const zammad_url = zammad_base_url.concat(entity_url);
    return this.httpService.get(zammad_url, {
      headers: { Authorization: bearer_token },
    });
  }

  private async cleanResponse(response: Promise<any>, zammad_url: string) {
    try {
      const json = JSON.stringify(
        (await response).data.assets.KnowledgeBaseAnswerTranslationContent,
      );
      const obj = JSON.parse(json);
      return obj[zammad_url]['body'];
    } catch (e) {
      this.logger.error(e);
      return 'Sorry we do not have this information at the moment';
    }
  }

  private getAuthCredentials() {
    const bearer_token = this.configService.get(this.BEARER_TOKEN_HEADER);
    const zammad_base_url = this.configService.get(this.BASE_URL);

    return { zammad_base_url, bearer_token };
  }
}
