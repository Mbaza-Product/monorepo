import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
} from "typeorm";

export enum IntentHandler {
  KB = "kb",
  API = "api",
  STATIC = "static",
}

export class IntentEntities {
  [key: string]: string;
}



@Entity({name: 'intents'})
export class IntentModel {

  public static readonly DEFAULT_LOCALE = "en";
  public static readonly DEFAULT_HANDLER = IntentHandler.KB;

  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column("simple-array")
  intents: string[];

  @Column()
  locale: string;

  @Column({ type: "simple-json" })
  entities: IntentEntities;

  @Column({
    type: "enum",
    enum: IntentHandler,
    default: IntentHandler.KB,
  })
  handler: IntentHandler;

  @Column({ type: "simple-json" })
  metadata: { [key: string]: string};

  @Column({ nullable: true, default: false })
  ignore_extra_entities?: boolean;

  @Column({ nullable: true, default: false })
  ignore_extra_rasa_entities?: boolean;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createDateTime?: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  lastChangedDateTime?: Date;

  constructor(data?: Partial<IntentModel>) {
    if (data) {
      Object.assign(this, data);

      if (!this.locale) {
        this.locale = IntentModel.DEFAULT_LOCALE;
      }
     
      if (!this.handler) {
        this.handler = IntentModel.DEFAULT_HANDLER;
      }
    }    
  }
}
