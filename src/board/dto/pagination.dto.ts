import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { BoardResponseDto } from './board-response.dto';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number) // string을 number로 변환
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number) // string을 number로 변환
  @IsNumber()
  @Min(1)
  limit?: number;
}

export class PaginatedBoardResponse {
  items: BoardResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
