import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
  IsDate,
} from 'class-validator';
import { AttendanceStatus } from '../entities/attendance.entity';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsString()
  memberName: string;

  @IsOptional()
  @IsString()
  memberPid?: string;

  @IsNotEmpty()
  @IsDate()
  attendanceDate: Date;

  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsNotEmpty()
  @IsString()
  leaderName: string;

  @IsNotEmpty()
  @IsString()
  leaderPid: string;

  @IsNotEmpty()
  @IsString()
  lifeSharing: string;

  @IsNotEmpty()
  @IsString()
  faith: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
