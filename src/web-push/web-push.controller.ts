import {
  Controller,
  Post,
  Delete,
  Body,
  Get,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { PushService } from './web-push.service';
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto';
import { SendPushNotificationDto } from './dto/send-push-notification.dto';
import { User } from './decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('push')
@UseGuards(JwtAuthGuard)
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  subscribe(
    @User('userId') userId: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: CreatePushSubscriptionDto,
  ) {
    return this.pushService.subscribe(userId, dto);
  }

  @Delete('unsubscribe')
  @HttpCode(HttpStatus.OK)
  unsubscribe(
    @User('userId') userId: string,
    @Query('endpoint') endpoint: string,
  ) {
    return this.pushService.unsubscribe(userId, endpoint);
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  sendNotification(
    @Body(new ValidationPipe({ transform: true })) dto: SendPushNotificationDto,
  ) {
    return this.pushService.sendNotification(dto);
  }

  @Post('send-all')
  @UseGuards(JwtAuthGuard) // 관리자만 접근 가능하도록 권한 설정 필요
  async sendToAll(@Body() dto: SendPushNotificationDto) {
    return this.pushService.sendNotificationToAll(dto);
  }

  @Get('subscriptions')
  getSubscriptions(@User('userId') userId: string) {
    return this.pushService.getSubscriptions(userId);
  }
}
