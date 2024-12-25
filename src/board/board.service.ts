import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardResponseDto } from './dto/board-response.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<BoardResponseDto> {
    const board = this.boardRepository.create(createBoardDto);
    const savedBoard = await this.boardRepository.save(board);
    return this.toResponseDto(savedBoard);
  }

  async findAll(boardId: string): Promise<BoardResponseDto[]> {
    const boards = await this.boardRepository.find({
      where: { boardId },
      order: { createdAt: 'DESC' },
    });
    return boards.map((board) => this.toResponseDto(board));
  }

  async findOne(id: string): Promise<BoardResponseDto> {
    const board = await this.boardRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
    if (!board) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }
    return this.toResponseDto(board);
  }

  async update(
    id: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<BoardResponseDto> {
    const board = await this.findOne(id);

    if (
      board.onlyAuthorCanModify &&
      board.authorId !== updateBoardDto.modifierId
    ) {
      throw new ForbiddenException('작성자만 수정할 수 있습니다.');
    }

    const updatedBoard = await this.boardRepository.save({
      ...board,
      ...updateBoardDto,
    });

    return this.toResponseDto(updatedBoard);
  }

  async remove(id: string, userId: string): Promise<void> {
    const board = await this.findOne(id);

    if (board.onlyAuthorCanModify && board.authorId !== userId) {
      throw new ForbiddenException('작성자만 삭제할 수 있습니다.');
    }

    await this.boardRepository.delete(id);
  }

  private toResponseDto(board: Board): BoardResponseDto {
    const {
      id,
      title,
      content,
      createdAt,
      authorId,
      modifierId,
      updatedAt,
      onlyAuthorCanModify,
      boardId,
      isTemplate,
    } = board;
    return {
      id,
      title,
      content,
      createdAt,
      authorId,
      modifierId,
      updatedAt,
      onlyAuthorCanModify,
      boardId,
      isTemplate,
    };
  }
}
