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

  @IsString()
  @IsOptional()
  profile_image: string;

  @IsDateString()
  birth: string;

  @IsString()
  @IsOptional()
  sarang: string;

  @IsBoolean()
  @IsOptional()
  daechung: boolean;

  @IsBoolean()
  @IsOptional()
  gender: boolean;
}
