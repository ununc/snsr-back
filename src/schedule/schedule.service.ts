import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { FindMonthlyScheduleDto } from './dto/find-monthly-schedule.dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(createScheduleDto);
    return await this.scheduleRepository.save(schedule);
  }

  async findMonthlySchedules(
    findMonthlyScheduleDto: FindMonthlyScheduleDto,
  ): Promise<Schedule[]> {
    const { year, month } = findMonthlyScheduleDto;

    // Calculate start and end dates of the month
    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    const endOfMonth = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

    return await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where(
        'schedule.startDate <= :endOfMonth::DATE AND schedule.endDate >= :startOfMonth::DATE',
        {
          startOfMonth,
          endOfMonth,
        },
      )
      .orderBy('schedule.startDate', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<Schedule> {
    return await this.scheduleRepository.findOneOrFail({ where: { id } });
  }

  async update(updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    const id = updateScheduleDto.id;
    await this.scheduleRepository.update(id, updateScheduleDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.scheduleRepository.delete(id);
  }
}
