import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushSubscription } from './entities/push-subscription.entity';
import { PushController } from './web-push.controller';
import { PushService } from './web-push.service';
import { Group } from 'src/group/entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PushSubscription, Group])],
  controllers: [PushController],
  providers: [PushService],
  exports: [PushService],
})
export class WebPushModule {}
