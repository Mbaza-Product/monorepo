export class IntentEntity {
  entity?: string;
  start?: number;
  end?: number;
  confidence_entity?: number;
  value?: string;
  extractor?: string;
}

export class IntentRequestModel {
  entities: IntentEntity[] | { entity: string, value: string};
}
