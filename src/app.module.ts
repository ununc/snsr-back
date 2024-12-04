import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
import { MenuModule } from './menu/menu.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtAuthExceptionFilter } from './jwt-auth-exception.filter';
import { CalendarModule } from './calender/calendar.module';
import { MinioModule } from './minio/minio.module';
import { WebPushModule } from './web-push/web-push.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역으로 사용하려면 true로 설정
      envFilePath: '.env', // .env 파일 경로 지정
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ConfigModule을 임포트하여 환경 변수 사용
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT')), // 문자열을 숫자로 변환
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('DB_SYNC') === 'true', // 문자열 'true'를 boolean으로 변환

          // 추가적인 데이터베이스 설정들도 필요하다면 여기에 추가할 수 있습니다
          logging: process.env.NODE_ENV !== 'production', // 개발 환경에서만 로깅 활성화
        };
      },
      inject: [ConfigService], // ConfigService를 주입
    }),
    AuthModule,
    GroupModule,
    MinioModule,
    MenuModule,
    CalendarModule,
    WebPushModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: JwtAuthExceptionFilter,
    },
  ],
})
export class AppModule {}
