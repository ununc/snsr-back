import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SongItem {
  @Column()
  url: string;

  @Column('text')
  lyricOrder: string;

  @Column()
  imageName: string;
}

@Entity()
export class Songform {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  describe: string;

  @Column({ type: 'timestamp' })
  singdate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  creatorPid: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updaterPid: string;

  @Column('jsonb')
  songList: SongItem[];
}
