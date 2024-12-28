import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Post('bulk')
  createBulk(@Body() createAttendanceDtos: CreateAttendanceDto[]) {
    return this.attendanceService.createBulk(createAttendanceDtos);
  }

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get('search/:daechung/:date')
  findByDate(@Param('daechung') daechung: string, @Param('date') date: string) {
    const attendanceDate = new Date(date);
    return this.attendanceService.findByDate(
      daechung === 'true',
      attendanceDate,
    );
  }

  @Get('search/:daechung/:date/:leaderPid')
  findByDateAndLeader(
    @Param('daechung') daechung: string,
    @Param('date') date: string,
    @Param('leaderPid') leaderPid: string,
  ) {
    const attendanceDate = new Date(date);
    return this.attendanceService.findByDateAndLeader(
      daechung === 'true',
      attendanceDate,
      leaderPid,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Patch()
  update(@Body() updateDtos: UpdateAttendanceDto[]) {
    return this.attendanceService.updateMultiple(updateDtos);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
