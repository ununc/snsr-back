import { IsNumber } from 'class-validator';

export class CreateCongregationDto {
  @IsNumber()
  man: number;

  @IsNumber()
  women: number;

  @IsNumber()
  online: number;
}
