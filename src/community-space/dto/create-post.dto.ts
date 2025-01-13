import {
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostType } from '../entities/post.entity';
import { CreatePraiseDto } from './sub/praise.dto';
import { CreateLiturgyDto } from './sub/liturgy.dto';
import { CreateLiturgistsDto } from './sub/liturgists.dto';
import { CreateCongregationDto } from './sub/congregation.dto';
import { CreateAdvertisementDto } from './sub/advertisement.dto';
import { CreateNewcomerDto } from './sub/newcomer.dto';
import { CreateBoardsDto } from './sub/board.dto';

export class CreatePostDto {
  @IsEnum(PostType)
  boardName: PostType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'targetDate must be in YYYY-MM-DD format',
  })
  targetDate?: string;

  @IsObject()
  @ValidateNested()
  @Type((options) => {
    switch (options.object?.boardName) {
      case PostType.LITURGY:
        return CreateLiturgyDto;
      case PostType.PRAISE:
        return CreatePraiseDto;
      case PostType.ANTHEM:
        return CreatePraiseDto;
      case PostType.LITURGISTS:
        return CreateLiturgistsDto;
      case PostType.CONGREGATION:
        return CreateCongregationDto;
      case PostType.ADVERTISEMENT:
        return CreateAdvertisementDto;
      case PostType.PLANNING:
      case PostType.OUTCOME:
        return CreateBoardsDto;
      case PostType.NEWCOMER:
      case PostType.ABSENTEEISM:
      case PostType.PROMOTION:
        return CreateNewcomerDto;
      case PostType.MANUAL:
        return CreateBoardsDto;
      case PostType.MONTHLY:
        return CreateBoardsDto;
      default:
        throw new Error(`Invalid post type: ${options.object?.boardName}`);
    }
  })
  content:
    | CreateLiturgyDto
    | CreatePraiseDto
    | CreateLiturgistsDto
    | CreateCongregationDto
    | CreateAdvertisementDto
    | CreateBoardsDto
    | CreateNewcomerDto;
}
