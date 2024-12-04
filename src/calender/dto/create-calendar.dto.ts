import {
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class CreateCalendarDto {
  @IsNumber()
  year: number;

  @IsNumber()
  month: number;

  @IsNumber()
  day: number;

  @IsNumber()
  period: number;

  @IsNumber()
  target_group: number;

  @IsNumber()
  write_group: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255) // 제목 길이 제한
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  writer?: string;
}
