import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

interface SongItem {
  url: string;
  lyricOrder: string;
  imageName: string;
  title: string;
}

@Entity()
export class Songform {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  kind: boolean;

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
