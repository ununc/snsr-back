import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { ContentItem } from './advertisement.dto';

export class CreateBoardsDto {
  @IsString()
  substance: string;

  @IsArray()
  @ValidateNested({ each: true }) // 배열의 각 요소를 검증
  @Type(() => ContentItem) // class-transformer를 위한 타입 지정
  contents: ContentItem[];
}
