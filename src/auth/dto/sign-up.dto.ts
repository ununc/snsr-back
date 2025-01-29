import {
  IsString,
  IsEmail,
  IsDateString,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  id: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  profile_image: string;

  @IsString()
  phone: string;

  @IsDateString()
  birth: Date;

  @IsString()
  sarang: string;

  @IsBoolean()
  daechung: boolean;

  @IsBoolean()
  gender: boolean;
}
