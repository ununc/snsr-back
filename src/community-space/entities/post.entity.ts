import { Reply } from 'src/community-reply/entities/reply.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';

export enum PostType {
  LITURGY = 'liturgy', // liturgy
  PRAISE = 'praise', // 찬양
  LITURGISTS = 'liturgists', // 예배 위원회
  CONGREGATION = 'congregation', // 예배 인워
  ADVERTISEMENT = 'advertisement',
  PLANNING = 'planning', // 이벤트 기획
  OUTCOME = 'outcome', // 이벤트 결과
  NEWCOMER = 'newcomer', // 새신자 관리
  ABSENTEEISM = 'absenteeism', // 장결자 관리
  PROMOTION = 'promotion', // 등반 인원
  MANUAL = 'manual',
  MONTHLY = 'Monthly', // 월례회 보고
}

@Entity('posts')
@Index('idx_boardName_targetDate_createdAt', [
  'boardName',
  'targetDate',
  'createdAt',
])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PostType,
  })
  boardName: PostType;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  title?: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  targetDate?: Date;

  @Column('jsonb')
  content: Record<string, any>;

  @Column()
  createdId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  updatedId: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Reply, (comment) => comment.post)
  replies: Reply[];
}
