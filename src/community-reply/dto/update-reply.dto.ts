import { IsString } from 'class-validator';

export class UpdateReplyDto {
  @IsString()
  content: string;
}
