import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  boardId: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
