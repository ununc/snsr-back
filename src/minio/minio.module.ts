import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';
import minioConfig from './minio.config';

@Module({
  imports: [ConfigModule.forFeature(minioConfig)],
  providers: [MinioService],
  controllers: [MinioController], // 컨트롤러 추가
  exports: [MinioService], // 다른 모듈에서도 MinioService를 사용할 수 있도록 export
})
export class MinioModule {}
