import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calendar } from './entities/calendar.entity';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
  ) {}

  async create(createCalendarDto: CreateCalendarDto): Promise<Calendar> {
    const calendar = this.calendarRepository.create(createCalendarDto);
    return await this.calendarRepository.save(calendar);
  }

  async findAll(year: number, month: number): Promise<Calendar[]> {
    return await this.calendarRepository.find({
      where: [
        { year: 0, month: 0 }, // 매년 매월
        { year: 0, month }, // 매년 특정 월
        { year, month: 0 }, // 특정 년도 매월
        { year, month }, // 특정 년도 특정 월
      ],
    });
  }

  async findOne(id: number): Promise<Calendar> {
    const calendar = await this.calendarRepository.findOne({ where: { id } });
    if (!calendar) {
      throw new NotFoundException(`Calendar with ID ${id} not found`);
    }
    return calendar;
  }

  async update(
    id: number,
    updateCalendarDto: UpdateCalendarDto,
  ): Promise<Calendar> {
    const calendar = await this.findOne(id);
    if (!calendar) {
      throw new NotFoundException(`Calendar with ID ${id} not found`);
    }
    await this.calendarRepository.update(id, updateCalendarDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.calendarRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Calendar with ID ${id} not found`);
    }
  }
}
