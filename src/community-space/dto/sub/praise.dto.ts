import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class SongItem {
  @IsString()
  title: string;

  @IsString()
  lyrics: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  link?: string;
}

export class CreatePraiseDto {
  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true }) // 배열의 각 요소를 검증
  @Type(() => SongItem) // class-transformer를 위한 타입 지정
  songs: SongItem[];
}
