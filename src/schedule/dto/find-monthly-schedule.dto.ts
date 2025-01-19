import { Transform } from 'class-transformer';
import { IsNumber, Min, Max } from 'class-validator';

export class FindMonthlyScheduleDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(2000)
  @Max(9999)
  year: number;
}
