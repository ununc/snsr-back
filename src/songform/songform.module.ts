import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongformService } from './songform.service';
import { SongformController } from './songform.controller';
import { Songform } from './entities/songform.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Songform])],
  controllers: [SongformController],
  providers: [SongformService],
})
export class SongformModule {}
