import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import moment from 'moment/moment';

@Entity('app_user')
export class AppUserEntity {
  @PrimaryGeneratedColumn()
  app_user_id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  updated_at: Date;

  @Column()
  created_at: Date;

  @Column()
  account_non_locked: boolean;

  @Column()
  account_non_expired: boolean;

  @Column()
  credentials_non_expired: boolean;

  @Column()
  enabled: boolean;
}