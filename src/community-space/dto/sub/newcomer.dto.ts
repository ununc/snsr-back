// 새가족
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNewcomerDto {
  @IsString()
  leader: string;

  // @IsString()
  // name: string; 타이틀에 작성?

  // 99또래
  @IsNumber()
  pear: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  job?: string;

  @IsBoolean()
  newComer: boolean;

  @IsOptional()
  @IsString()
  churchName?: string;

  @IsOptional()
  @IsString()
  objectName?: string;

  // @IsDateString()
  // registrationDate: string; targetDate?

  @IsBoolean()
  baptism: boolean;

  @IsBoolean()
  pastorVisited: boolean;

  @IsBoolean()
  promotionEnd: boolean;

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
