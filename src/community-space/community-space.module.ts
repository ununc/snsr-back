import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunitySpaceController } from './community-space.controller';
import { CommunitySpaceService } from './community-space.service';
import { Post } from './entities/post.entity';
import { UserInfo } from 'src/auth/entities/user-info.entity';
import { Reply } from 'src/community-reply/entities/reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Reply, UserInfo])],
  controllers: [CommunitySpaceController],
  providers: [CommunitySpaceService],
})
export class CommunitySpaceModule {}
