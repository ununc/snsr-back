import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  content: string;

  @IsUUID()
  boardId: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
