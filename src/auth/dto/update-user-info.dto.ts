import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class UpdateUserInfoDto {
  @IsString()
  pid: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDateString()
  @IsOptional()
  birth?: Date;

  @IsString()
  @IsOptional()
  sarang: string;

  @IsBoolean()
  @IsOptional()
  daechung: boolean;
}
