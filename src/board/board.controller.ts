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
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardResponseDto } from './dto/board-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseDto> {
    return await this.boardService.create(createBoardDto);
  }

  @Get()
  async findAll(
    @Query('boardId') boardId: string,
  ): Promise<BoardResponseDto[]> {
    return await this.boardService.findAll(boardId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BoardResponseDto> {
    return await this.boardService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateBoardDto: UpdateBoardDto,
  ): Promise<BoardResponseDto> {
    return await this.boardService.update(id, updateBoardDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    return await this.boardService.remove(id, userId);
  }
}
