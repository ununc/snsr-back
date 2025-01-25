import { IsArray, IsString } from 'class-validator';

export class CreateBoardsDto {
  @IsString()
  substance: string;

  @IsArray()
  @IsString({ each: true })
  contents: string[];
}
