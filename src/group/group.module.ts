import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entities/group.entity';
import { UserInfo } from 'src/auth/entities/user-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, UserInfo])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
