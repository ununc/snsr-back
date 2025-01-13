import { IsString } from 'class-validator';

export class CreateLiturgistsDto {
  @IsString()
  worship: string;

  @IsString()
  sermon: string;

  @IsString()
  praise: string;

  @IsString()
  specialSong: string;

  @IsString()
  subtitle: string;

  @IsString()
  video: string;

  @IsString()
  sound: string;

  @IsString()
  others: string;
}
