import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateLiturgyDto {
  // 말씀 제목
  @IsString()
  preach: string;

  // 본문 말씀
  @IsString()
  bibleVerses: string;

  // 콘티
  @IsString()
  continuity: string;

  // 적용 찬양
  @IsString()
  hymn: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
