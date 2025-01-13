import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReplyService } from './community-reply.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';

@Controller('reply')
@UseGuards(JwtAuthGuard)
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post(':userId')
  create(
    @Body() createCommentDto: CreateReplyDto,
    @Param('userId') userId: string,
  ) {
    return this.replyService.create(createCommentDto, userId);
  }

  @Get('board/:boardId')
  findAll(@Param('boardId') boardId: string) {
    return this.replyService.findAll(boardId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateReplyDto) {
    return this.replyService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.replyService.remove(id);
  }
}
