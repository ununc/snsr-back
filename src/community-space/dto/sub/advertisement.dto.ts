import { IsArray, IsDateString, IsString } from 'class-validator';

export class CreateAdvertisementDto {
  // 어떤 광고인지 무엇이 필요한지
  @IsString()
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  contents: string[];
}
