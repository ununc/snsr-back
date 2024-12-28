import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import * as https from 'https';
import * as fs from 'fs';

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;
  private readonly logger = new Logger(MinioService.name);
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    // MinIO 클라이언트 초기화
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('minio.endPoint'),
      port: this.configService.get('minio.port'),
      useSSL: this.configService.get('minio.useSSL'),
      accessKey: this.configService.get('minio.accessKey'),
      secretKey: this.configService.get('minio.secretKey'),
      transportAgent: new https.Agent({
        rejectUnauthorized: false,
        ca: fs.readFileSync('/app/ssl/root.crt'),
      }),
    });

    this.bucket = this.configService.get('minio.bucket');
    this.initializeBucket();
  }

  private async initializeBucket() {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucket);
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucket);
        this.logger.log(`Bucket ${this.bucket} created successfully`);
      }
    } catch (error) {
      this.logger.error(`Error initializing bucket: ${error.message}`);
    }
  }

  // 파일 업로드를 위한 presigned URL 생성
  async generateUploadUrl(
    objectName: string,
    expiry: number = 6 * 60 * 60,
  ): Promise<string> {
    try {
      const presignedUrl = await this.minioClient.presignedPutObject(
        this.bucket,
        objectName,
        expiry,
      );
      return presignedUrl;
    } catch (error) {
      this.logger.error(`Error generating presigned URL: ${error.message}`);
      throw error;
    }
  }

  // 파일 다운로드를 위한 presigned URL 생성
  async generateDownloadUrl(
    objectName: string,
    expiry: number = 12 * 60 * 60,
  ): Promise<string> {
    try {
      const presignedUrl = await this.minioClient.presignedGetObject(
        this.bucket,
        objectName,
        expiry,
      );
      return presignedUrl;
    } catch (error) {
      this.logger.error(`Error generating presigned URL: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(objectName: string): Promise<boolean> {
    try {
      // 파일이 실제로 존재하는지 먼저 확인
      try {
        await this.minioClient.statObject(this.bucket, objectName);
      } catch (error) {
        // statObject에서 에러가 발생하면 파일이 존재하지 않는 것
        return false;
      }

      // 파일 삭제 실행
      await this.minioClient.removeObject(this.bucket, objectName);

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}
