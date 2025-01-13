import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/community-space/entities/post.entity';
import { ReplyService } from './community-reply.service';
import { ReplyController } from './community-reply.controller';
import { Reply } from './entities/reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reply, Post])],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
