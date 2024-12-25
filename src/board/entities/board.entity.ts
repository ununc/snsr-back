import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Comment } from './comment.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column()
  authorId: string;

  @Column({ nullable: true })
  modifierId: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column()
  isTemplate: boolean;

  @Column({ default: true })
  onlyAuthorCanModify: boolean;

  @Column()
  boardId: string;

  @OneToMany(() => Comment, (comment) => comment.board)
  comments: Comment[];
}
