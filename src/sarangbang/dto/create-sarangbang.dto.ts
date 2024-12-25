import {
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class MemberDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  pid?: string;
}

export class CreateSarangBangDto {
  @IsString()
  sarang: string;

  @IsBoolean()
  daechung: boolean;

  @IsString()
  leaderName: string;

  @IsString()
  leaderPid: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members: MemberDto[];
}
