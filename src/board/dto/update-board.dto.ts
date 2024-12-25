import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  modifierId: string;
}
