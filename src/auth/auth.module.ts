import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from './entities/user.entity';
import { UserInfo } from './entities/user-info.entity';
import { ConfigService } from '@nestjs/config';
import { MenuModule } from 'src/menu/menu.module';
import { Menu } from 'src/menu/entities/menu.entity';
import { Group } from 'src/group/entities/group.entity';

@Module({
  imports: [
    /**
     TypeORM의 기능을 사용하여 User와 UserInfo 엔티티를 이 모듈에서 사용할 수 있게 합니다.
     이를 통해 해당 엔티티들에 대한 리포지토리를 주입받아 사용할 수 있습니다.  
     */
    TypeOrmModule.forFeature([User, UserInfo, Menu, Group]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
    MenuModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
