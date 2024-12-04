import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('calendars')
export class Calendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @Column()
  month: number;

  @Column()
  day: number;

  @Column()
  period: number;

  @Column({ type: 'varchar', length: 255 }) // 또는 원하는 길이 지정
  title: string;

  @Column({ type: 'text' }) // 긴 문자열은 text 타입 권장
  content: string;

  @Column()
  target_group: number;

  @Column()
  write_group: number;

  @Column()
  writer: string;
}
