import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class DefaultEntity {
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}

export abstract class DefaultAutoIdEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
}
