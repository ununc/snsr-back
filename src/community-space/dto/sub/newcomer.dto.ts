// 새가족
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNewcomerDto {
  @IsString()
  leader: string;

  @IsString()
  name: string;

  // 99또래
  @IsNumber()
  pear: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  job?: string;

  @IsNumber()
  week: number;

  @IsBoolean()
  newComer: boolean;

  @IsBoolean()
  baptism: boolean;

  @IsDateString()
  registrationDate: string;

  @IsOptional()
  @IsString()
  registrationReason?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notes?: string[];

  @IsOptional()
  @IsString()
  absence?: string;

  @IsOptional()
  @IsString()
  climbing?: string;
}
