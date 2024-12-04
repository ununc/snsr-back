import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class SubscriptionKeysDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  p256dh: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  auth: string;
}

export class CreatePushSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @IsOptional()
  @IsNumber()
  expirationTime?: number | null;

  @ValidateNested()
  @Type(() => SubscriptionKeysDto)
  keys: SubscriptionKeysDto;
}
