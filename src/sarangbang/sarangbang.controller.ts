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
import { SarangBangService } from './sarangbang.service';
import { CreateSarangBangDto } from './dto/create-sarangbang.dto';
import { UpdateSarangBangDto } from './dto/update-sarangbang.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sarangbang')
export class SarangBangController {
  constructor(private readonly sarangBangService: SarangBangService) {}

  @Post()
  create(@Body() createSarangBangDto: CreateSarangBangDto) {
    return this.sarangBangService.create(createSarangBangDto);
  }

  @Get()
  findAll() {
    return this.sarangBangService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sarangBangService.findOne(id);
  }

  @Get('leader/:pid')
  findByLeaderPid(@Param('pid') leaderPid: string) {
    return this.sarangBangService.findByLeaderPid(leaderPid);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSarangBangDto: UpdateSarangBangDto,
  ) {
    return this.sarangBangService.update(id, updateSarangBangDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sarangBangService.remove(id);
  }
}
