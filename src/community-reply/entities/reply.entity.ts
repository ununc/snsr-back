import { Post } from 'src/community-space/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column()
  authorId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ nullable: true })
  parentId: string;

  @ManyToOne(() => Post, (board) => board.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  post: Post;

  @Column()
  boardId: string;

  @ManyToOne(() => Reply, (comment) => comment.children)
  @JoinColumn({ name: 'parentId' })
  parent: Reply;

  @OneToMany(() => Reply, (comment) => comment.parent)
  children: Reply[];
}
