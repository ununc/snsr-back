import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const attendance = this.attendanceRepository.create(createAttendanceDto);
    return await this.attendanceRepository.save(attendance);
  }

  async findAll(): Promise<Attendance[]> {
    return await this.attendanceRepository.find();
  }

  async findOne(id: string): Promise<Attendance> {
    return await this.attendanceRepository.findOne({ where: { id } });
  }

  async findByDateAndLeader(
    attendanceDate: Date,
    leaderPid: string,
  ): Promise<Attendance> {
    return await this.attendanceRepository.findOne({
      where: {
        attendanceDate,
        leaderPid,
      },
    });
  }

  async update(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    await this.attendanceRepository.update(id, updateAttendanceDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.attendanceRepository.delete(id);
  }
}
