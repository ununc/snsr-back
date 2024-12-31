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

  @IsOptional()
  @IsString()
  @IsUrl()
  badge?: string; // iOS 앱 아이콘의 배지 이미지 URL

  @IsOptional()
  @IsString()
  tag?: string; // 알림 그룹화를 위한 식별자
}
