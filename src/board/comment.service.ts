import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/comment/create-comment.dto';
import { UpdateCommentDto } from './dto/comment/update-comment.dto';
import { CommentResponseDto } from './dto/comment/comment-response.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const comment = this.commentRepository.create(createCommentDto);

    if (createCommentDto.parentId) {
      const parentComment = await this.commentRepository.findOne({
        where: {
          id: createCommentDto.parentId,
          boardId: createCommentDto.boardId,
        },
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const savedComment = await this.commentRepository.save(comment);
    return this.toResponseDto(savedComment);
  }

  async findByBoardId(boardId: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { boardId },
      relations: ['children'],
      order: { createdAt: 'ASC' },
    });

    return comments
      .filter((comment) => !comment.parentId)
      .map((comment) => this.toResponseDto(comment));
  }

  async update(
    id: string,
    authorId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.authorId !== authorId) {
      throw new BadRequestException('작성자만 수정할 수 있습니다.');
    }

    Object.assign(comment, updateCommentDto);
    const updatedComment = await this.commentRepository.save(comment);
    return this.toResponseDto(updatedComment);
  }

  async remove(id: string, authorId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.authorId !== authorId) {
      throw new BadRequestException('작성자만 삭제할 수 있습니다.');
    }

    if (comment.children.length > 0) {
      throw new BadRequestException('답글이 있는 댓글은 삭제할 수 없습니다.');
    }

    await this.commentRepository.remove(comment);
  }

  private toResponseDto(comment: Comment): CommentResponseDto {
    const {
      id,
      content,
      authorId,
      createdAt,
      updatedAt,
      parentId,
      boardId,
      children,
    } = comment;
    return {
      id,
      content,
      authorId,
      createdAt,
      updatedAt,
      parentId,
      boardId,
      children: children?.map((child) => this.toResponseDto(child)),
    };
  }
}
