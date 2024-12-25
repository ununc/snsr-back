import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  Length,
  IsUUID,
} from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  boardId: string;

  @IsBoolean()
  isTemplate: boolean;

  @IsBoolean()
  @IsOptional()
  onlyAuthorCanModify?: boolean;
}
