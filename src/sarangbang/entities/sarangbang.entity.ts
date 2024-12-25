import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SarangBang {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sarang: string;

  @Column()
  daechung: boolean;

  @Column()
  leaderName: string;

  @Column()
  leaderPid: string;

  @Column('jsonb', { nullable: true })
  members: Array<{ name: string; pid: string | null }>;
}
