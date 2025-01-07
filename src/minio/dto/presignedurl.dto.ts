import { IsNotEmpty, IsString } from 'class-validator';

export class PresignedUrlDto {
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
