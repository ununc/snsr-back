import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/comment/create-comment.dto';
import { UpdateCommentDto } from './dto/comment/update-comment.dto';
import { CommentResponseDto } from './dto/comment/comment-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return await this.commentService.create(createCommentDto);
  }

  @Get('board/:boardId')
  async findByBoardId(
    @Param('boardId') boardId: string,
  ): Promise<CommentResponseDto[]> {
    return await this.commentService.findByBoardId(boardId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Query('authorId') authorId: string,
    @Body(ValidationPipe) updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    return await this.commentService.update(id, authorId, updateCommentDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('authorId') authorId: string,
  ): Promise<void> {
    return await this.commentService.remove(id, authorId);
  }
}
