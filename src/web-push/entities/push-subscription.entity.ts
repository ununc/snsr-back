import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserInfo } from '../../auth/entities/user-info.entity';

@Entity()
export class PushSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('push_subscription_user_id_idx')
  @Column() // 타입을 uuid로 변경
  userId: string;

  @ManyToOne(() => UserInfo)
  userInfo: UserInfo;

  @Index('push_subscription_endpoint_idx')
  @Column({ unique: true })
  endpoint: string;

  @Column({ nullable: true, type: 'timestamptz' })
  expirationTime: Date | null;

  @Column('json')
  keys: {
    p256dh: string;
    auth: string;
  };

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
