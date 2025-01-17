import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommunitySpaceService } from './community-space.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostType } from './entities/post.entity';

@Controller('space')
@UseGuards(JwtAuthGuard)
export class CommunitySpaceController {
  constructor(private readonly communitySpaceService: CommunitySpaceService) {}

  @Post(':pid')
  create(@Body() createPostDto: CreatePostDto, @Param('pid') pid: string) {
    return this.communitySpaceService.create(pid, createPostDto);
  }

  @Get('promooffer/:done')
  async findPromotion(@Param('done') done: string) {
    return this.communitySpaceService.findPromotion(done === 'true');
  }

  @Get('advertisement/range/:yearMonth')
  async findByMonth(@Param('yearMonth') yearMonth: string) {
    // YYYY-MM 형식 검증
    if (!/^\d{4}-\d{2}$/.test(yearMonth)) {
      throw new BadRequestException('날짜 형식은 YYYY-MM 이어야 합니다.');
    }
    const [year, month] = yearMonth.split('-').map(Number);
    return this.communitySpaceService.findByMonth(year, month);
  }

  @Get(':boardName/:month?')
  findAll(
    @Param('boardName') boardName?: PostType,
    @Param('month') month?: string,
  ) {
    if (!month) {
      return this.communitySpaceService.findAll(boardName);
    }

    // month가 YYYY-MM 형식인지 검증
    if (!/^\d{4}-\d{2}$/.test(month)) {
      throw new BadRequestException('월 형식은 YYYY-MM 이어야 합니다.');
    }

    const [year, monthStr] = month.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthStr) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthStr), 0);

    return this.communitySpaceService.findAllByDateRange(
      boardName,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communitySpaceService.findOne(id);
  }

  @Patch(':pid')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipMissingProperties: true, // 이 옵션 추가
    }),
  )
  update(@Param('pid') pid: string, @Body() updatePostDto: UpdatePostDto) {
    return this.communitySpaceService.update(pid, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communitySpaceService.remove(id);
  }
}
