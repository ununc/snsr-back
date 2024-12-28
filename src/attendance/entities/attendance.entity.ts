import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum AttendanceStatus {
  NO = 'NO',
  WORSHIP = 'WORSHIP',
  CELL = 'CELL',
  ALL = 'ALL',
}

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  memberName: string;

  @Column({ nullable: true, default: null })
  memberPid: string | null;

  @Column({ type: 'date' })
  attendanceDate: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.NO,
  })
  status: AttendanceStatus;

  @Column()
  leaderName: string;

  @Column()
  leaderPid: string;

  @Column()
  daechung: boolean;

  @Column()
  lifeSharing: string;

  @Column()
  faith: string;

  @Column({ default: '' })
  notes: string;
}
