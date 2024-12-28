import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { Comment } from './entities/comment.entity';
import { UserInfo } from 'src/auth/entities/user-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Comment, UserInfo])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
