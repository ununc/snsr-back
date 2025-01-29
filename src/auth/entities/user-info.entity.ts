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
  profile_image?: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  gender: boolean;

  @Column()
  phone: string;

  @Column({ type: 'date', nullable: true })
  birth: Date;

  @Column()
  sarang: string;

  @Column()
  daechung: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('simple-array')
  role_list: string[];

  @OneToOne(() => User, (user) => user.userInfo, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'user_pid',
    foreignKeyConstraintName: 'fk_user_info_user',
  })
  user: User;
}
