import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateCalendarDto } from './dto/update-calendar.dto';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  create(@Body() createCalendarDto: CreateCalendarDto) {
    return this.calendarService.create(createCalendarDto);
  }

  @Get()
  findAll(@Query('year') year: number = 0, @Query('month') month: number = 0) {
    return this.calendarService.findAll(+year, +month);
  }

  // @Put(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCalendarDto: CreateCalendarDto
  // ) {
  //   return this.calendarService.update(+id, updateCalendarDto);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCalendarDto: UpdateCalendarDto,
  ) {
    return this.calendarService.update(+id, updateCalendarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarService.remove(+id);
  }
}
