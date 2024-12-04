import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn('uuid')
  pid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  phone: string;

  @Column()
  birth: Date;

  @Column()
  sarang: string;

  @Column()
  daechung: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('simple-array')
  role_list: string[];

  @OneToOne(() => User, (user) => user.userInfo)
  @JoinColumn({ name: 'user_pid' })
  user: User;
}