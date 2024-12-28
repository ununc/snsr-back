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
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const attendance = this.attendanceRepository.create(createAttendanceDto);
    return await this.attendanceRepository.save(attendance);
  }

  async createBulk(createAttendanceDtos: CreateAttendanceDto[]) {
    const createPromises = createAttendanceDtos.map((dto) => this.create(dto));
    return await Promise.all(createPromises);
  }

  async findAll(): Promise<Attendance[]> {
    return await this.attendanceRepository.find();
  }

  async findOne(id: string): Promise<Attendance> {
    return await this.attendanceRepository.findOne({ where: { id } });
  }

  async findByDate(
    daechung: boolean,
    attendanceDate: Date,
  ): Promise<Pick<Attendance, 'leaderName' | 'leaderPid'>[]> {
    const results = await this.attendanceRepository.find({
      where: {
        attendanceDate,
        daechung,
      },
      select: {
        leaderName: true,
        leaderPid: true,
      },
    });

    return Object.values(
      results.reduce((acc, curr) => {
        acc[curr.leaderPid] = curr;
        return acc;
      }, {}),
    );
  }

  async findByDateAndLeader(
    daechung: boolean,
    attendanceDate: Date,
    leaderPid: string,
  ): Promise<Attendance[]> {
    return await this.attendanceRepository.find({
      where: {
        daechung,
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

  async updateMultiple(
    updateAttendanceDto: UpdateAttendanceDto[],
  ): Promise<Attendance[]> {
    const updatePromises = updateAttendanceDto.map((dto) =>
      this.update(dto.id, dto),
    );
    return await Promise.all(updatePromises);
  }

  async remove(id: string): Promise<void> {
    await this.attendanceRepository.delete(id);
  }
}
