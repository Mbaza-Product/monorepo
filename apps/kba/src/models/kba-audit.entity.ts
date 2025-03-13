import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
} from "typeorm";
import { IntentEntities } from "./intents.entity";


@Entity({name: 'kba-audit'})
export class KBAAuditModel {

  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  intent: string;

  @Column()
  locale: string;

  @Column()
  entities?: string;

  @Column()
  response?: string;

  @Column()
  resolved?: boolean;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createDateTime?: Date;


  constructor(data?: Partial<KBAAuditModel>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
