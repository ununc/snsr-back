import { IsNumber, IsString, IsOptional, Length } from 'class-validator';

export class UpdateCalendarDto {
  @IsNumber()
  @IsOptional()
  year?: number;

  @IsNumber()
  @IsOptional()
  month?: number;

  @IsNumber()
  @IsOptional()
  day?: number;

  @IsNumber()
  @IsOptional()
  period?: number;

  @IsNumber()
  @IsOptional()
  target_group?: number;

  @IsNumber()
  @IsOptional()
  write_group?: number;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
