import { Entity, PrimaryColumn } from 'typeorm';
import { DefaultEntity } from '@libs/typeorm/domain/default-entity.entity';

@Entity()
export class User extends DefaultEntity {
  @PrimaryColumn({ unique: true })
  id: string;
}
