import {
  IsString,
  IsOptional,
  IsObject,
  MaxLength,
  IsUrl,
  IsArray,
} from 'class-validator';

export class SendPushNotificationDto {
  @IsString()
  @MaxLength(50)
  title: string;

  @IsString()
  @MaxLength(200)
  body: string;

  @IsOptional()
  @IsUrl()
  icon?: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  groupIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  userIds?: string[];
}
