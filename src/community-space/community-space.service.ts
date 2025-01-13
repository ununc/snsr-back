import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostType } from './entities/post.entity';
import { UserInfo } from 'src/auth/entities/user-info.entity';

@Injectable()
export class CommunitySpaceService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(pid: string, createPostDto: CreatePostDto) {
    const post = this.postRepository.create({
      ...createPostDto,
      createdId: pid,
      updatedId: '',
    });
    return await this.postRepository.save(post);
  }

  async findAll(boardName: PostType) {
    return await this.postRepository.find({
      where: {
        boardName,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findAllByDateRange(
    boardName: PostType,
    startDate: Date,
    endDate: Date,
  ) {
    return this.postRepository.find({
      where: {
        boardName,
        targetDate: Between(startDate, endDate),
      },
      // relations: ['replies'],
      order: {
        targetDate: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(pid: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(updatePostDto.id);

    Object.assign(post, {
      ...updatePostDto,
      updatedBy: pid,
    });

    return await this.postRepository.save(post);
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    return await this.postRepository.remove(post);
  }
}
