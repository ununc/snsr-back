import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SarangBangService } from './sarangbang.service';
import { SarangBangController } from './sarangbang.controller';
import { SarangBang } from './entities/sarangbang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SarangBang])],
  controllers: [SarangBangController],
  providers: [SarangBangService],
})
export class SarangBangModule {}
