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
import { SongformService } from './songform.service';
import { CreateSongformDto } from './dto/create-songform.dto';
import { UpdateSongformDto } from './dto/update-songform.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Songform } from './entities/songform.entity';

export interface SongItemWithNames extends Songform {
  creatorName: string;
  updaterName: string;
}

@UseGuards(JwtAuthGuard)
@Controller('songform')
export class SongformController {
  constructor(private readonly songformService: SongformService) {}

  @Post()
  create(@Body() createSongformDto: CreateSongformDto) {
    return this.songformService.create(createSongformDto);
  }

  @Get()
  findAll() {
    return this.songformService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SongItemWithNames> {
    return this.songformService.findOne(id);
  }

  @Get(':kind/:yearMonth')
  findMonth(
    @Param('kind') kind: string,
    @Param('yearMonth') yearMonth: string,
  ) {
    return this.songformService.findByMonth(kind === 'true', yearMonth);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSongformDto: UpdateSongformDto,
  ) {
    return this.songformService.update(id, updateSongformDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songformService.remove(id);
  }
}
