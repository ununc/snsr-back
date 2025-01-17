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

  async findByMonth(year: number, month: number) {
    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    // endOfMonth 계산 수정
    // 다음 달의 0일은 현재 달의 마지막 날입니다
    const endOfMonth = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;
    const advertisements = await this.postRepository
      .createQueryBuilder('post')
      .where('post.boardName = :boardName', {
        boardName: PostType.ADVERTISEMENT,
      })
      .andWhere(
        "CAST(post.content->>'startDate' AS DATE) <= :endOfMonth::DATE AND CAST(post.content->>'endDate' AS DATE) >= :startOfMonth::DATE",
        {
          startOfMonth,
          endOfMonth,
        },
      )
      .orderBy('post.createdAt', 'ASC')
      .getMany();

    return advertisements;
  }

  async findPromotion(promotionEnd: boolean) {
    return this.postRepository
      .createQueryBuilder('post')
      .where('post.boardName = :boardName', { boardName: PostType.PROMOTION })
      .andWhere("(post.content ->> 'promotionEnd')::boolean = :promotionEnd", {
        promotionEnd,
      })
      .orderBy('post.createdAt', promotionEnd ? 'DESC' : 'ASC')
      .getMany()
      .then((posts) =>
        posts.map((post) => {
          const { notes, absence, ...restContent } = post.content;
          return { ...post, content: restContent };
        }),
      );
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
    delete updatePostDto.id;
    Object.assign(post, {
      ...updatePostDto,
      updatedId: pid,
    });

    return await this.postRepository.save(post);
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    return await this.postRepository.remove(post);
  }
}
