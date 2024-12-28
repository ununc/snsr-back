import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongformService } from './songform.service';
import { SongformController } from './songform.controller';
import { Songform } from './entities/songform.entity';
import { UserInfo } from 'src/auth/entities/user-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Songform, UserInfo])],
  controllers: [SongformController],
  providers: [SongformService],
})
export class SongformModule {}
