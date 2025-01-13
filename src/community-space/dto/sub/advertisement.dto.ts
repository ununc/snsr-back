import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum ContentType {
  VIDEO = 'video',
  PICTURE = 'picture',
  FILE = 'file',
}

export class ContentItem {
  @IsEnum(ContentType)
  type: ContentType;

  @IsString()
  objectPath: string;
}

export class CreateAdvertisementDto {
  // 어떤 광고인지 무엇이 필요한지
  @IsString()
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  // 첨부 파일 구분
  @IsArray()
  @ValidateNested({ each: true }) // 배열의 각 요소를 검증
  @Type(() => ContentItem) // class-transformer를 위한 타입 지정
  contents: ContentItem[];
}
