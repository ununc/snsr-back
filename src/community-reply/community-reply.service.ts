import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/community-space/entities/post.entity';
import { Reply } from './entities/reply.entity';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private commentRepository: Repository<Reply>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(
    createCommentDto: CreateReplyDto,
    authorId: string,
  ): Promise<Reply> {
    const post = await this.postRepository.findOne({
      where: { id: createCommentDto.boardId },
    });

    if (!post) {
      throw new NotFoundException(
        `Post with ID ${createCommentDto.boardId} not found`,
      );
    }

    let parent: Reply | null = null;
    if (createCommentDto.parentId) {
      parent = await this.commentRepository.findOne({
        where: { id: createCommentDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent comment with ID ${createCommentDto.parentId} not found`,
        );
      }
    }

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      authorId,
      boardId: createCommentDto.boardId,
      parentId: createCommentDto.parentId,
    });

    return this.commentRepository.save(comment);
  }

  async findAll(boardId: string): Promise<Reply[]> {
    return this.commentRepository.find({
      where: { boardId },
      relations: ['children'],
      order: {
        createdAt: 'DESC',
        children: {
          createdAt: 'ASC',
        },
      },
    });
  }

  async update(
    id: string,
    updateCommentDto: UpdateReplyDto,
    // authorId: string,
  ): Promise<Reply> {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`Reply with ID ${id} not found`);
    }

    // if (comment.authorId !== authorId) {
    //   throw new ForbiddenException('You can only update your own comments');
    // }

    comment.content = updateCommentDto.content;
    return this.commentRepository.save(comment);
  }

  async remove(id: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`Reply with ID ${id} not found`);
    }

    // if (comment.authorId !== authorId) {
    //   throw new ForbiddenException('You can only delete your own comments');
    // }

    await this.commentRepository.remove(comment);
  }
}
