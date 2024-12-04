import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  order: number;

  @IsString()
  @IsOptional()
  owner?: string;

  @IsBoolean()
  can_write: boolean;
}
