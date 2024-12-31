import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as webpush from 'web-push';
import { plainToClass } from 'class-transformer';
import { PushSubscription } from './entities/push-subscription.entity';
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto';
import { SendPushNotificationDto } from './dto/send-push-notification.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { Group } from 'src/group/entities/group.entity';

@Injectable()
export class PushService {
  constructor(
    @InjectRepository(PushSubscription)
    private readonly pushSubscriptionRepository: Repository<PushSubscription>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      throw new Error('VAPID keys must be set in environment variables');
    }

    webpush.setVapidDetails(
      'mailto:' + process.env.VAPID_EMAIL,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );
  }

  async subscribe(
    userId: string,
    dto: CreatePushSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const existingSubscription = await this.pushSubscriptionRepository.findOne({
      where: { endpoint: dto.endpoint },
    });
    if (existingSubscription) {
      if (existingSubscription.userId !== userId) {
        throw new BadRequestException(
          'Subscription already exists for another user',
        );
      }
      return plainToClass(SubscriptionResponseDto, existingSubscription);
    }
    const subscription = this.pushSubscriptionRepository.create({
      userId,
      endpoint: dto.endpoint,
      expirationTime: dto.expirationTime ? new Date(dto.expirationTime) : null,
      keys: dto.keys,
    });

    const savedSubscription =
      await this.pushSubscriptionRepository.save(subscription);
    return plainToClass(SubscriptionResponseDto, savedSubscription);
  }

  async unsubscribe(userId: string, endpoint: string): Promise<void> {
    const result = await this.pushSubscriptionRepository.delete({
      userId,
      endpoint,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Subscription not found');
    }
  }

  async sendNotification(
    dto: SendPushNotificationDto,
  ): Promise<{ successCount: number; failureCount: number }> {
    // 대상 유저 ID 목록을 저장할 Set (중복 제거)
    const targetUserIds = new Set<string>();
    // 그룹 ID가 제공된 경우 해당 그룹의 모든 유저 ID를 추가
    if (dto.groupIds && dto.groupIds.length > 0) {
      const groups = await this.groupRepository.findBy({
        id: In(dto.groupIds),
      });
      for (const group of groups) {
        group.user_pid_list.forEach((userId) => targetUserIds.add(userId));
      }
    }

    // 개별 유저 ID가 제공된 경우 추가 (Set이므로 자동으로 중복 제거)
    if (dto.userIds && dto.userIds.length > 0) {
      dto.userIds.forEach((userId) => targetUserIds.add(userId));
    }

    // 구독 정보 조회
    const subscriptions = await this.pushSubscriptionRepository.find({
      where: {
        userId: In([...targetUserIds]), // Set을 배열로 변환
      },
    });

    let successCount = 0;
    let failureCount = 0;

    const notifications = subscriptions.map(async (subscription) => {
      const payload = JSON.stringify({
        title: dto.title,
        body: dto.body,
        icon: dto.icon,
        data: dto.data,
      });

      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys,
          },
          payload,
        );
        successCount++;
      } catch (error) {
        failureCount++;
        if (error.statusCode === 410 || error.statusCode === 404) {
          await this.pushSubscriptionRepository.delete(subscription.id);
        }
      }
    });

    await Promise.all(notifications);
    return { successCount, failureCount };
  }

  async sendNotificationToAll(dto: SendPushNotificationDto) {
    const allSubscriptions = await this.pushSubscriptionRepository.find();
    const results = {
      successCount: 0,
      failureCount: 0,
      errors: [] as Array<{ subscriptionId: number; error: string }>,
    };

    await Promise.all(
      allSubscriptions.map(async (subscription) => {
        try {
          const isAppleDevice =
            subscription.endpoint.includes('web.push.apple.com');

          const payload = JSON.stringify({
            title: dto.title,
            body: dto.body,
            icon: dto.icon,
            badge: dto.badge || '/icons/apple-touch-icon.svg',
            timestamp: Date.now(),
            tag: dto.tag || 'default',
            ...dto.data,
          });

          const options = {
            TTL: 24 * 60 * 60,
            urgency: 'normal',
            headers: isAppleDevice
              ? {
                  'apns-push-type': 'alert',
                  'apns-priority': '10',
                  'apns-topic': `web.${new URL(process.env.APP_URL).host}`,
                  'apns-expiration':
                    Math.floor(Date.now() / 1000) + 24 * 60 * 60,
                }
              : undefined,
          };

          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: subscription.keys,
            },
            payload,
            options,
          );

          results.successCount++;
        } catch (error) {
          console.error('Push notification failed:', {
            endpoint: subscription.endpoint,
            error: error.message,
            statusCode: error.statusCode,
            body: error.body,
            subscription: subscription,
          });

          results.failureCount++;
          results.errors.push({
            subscriptionId: subscription.id,
            error: error.message,
          });

          // 구독이 더 이상 유효하지 않은 경우 삭제
          if (error.statusCode === 410 || error.statusCode === 404) {
            await this.pushSubscriptionRepository.delete(subscription.id);
          }
        }
      }),
    );

    return results;
  }

  async getSubscriptions(userId: string): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.pushSubscriptionRepository.find({
      where: { userId },
    });

    return plainToClass(SubscriptionResponseDto, subscriptions, {
      excludeExtraneousValues: true,
    });
  }
}
