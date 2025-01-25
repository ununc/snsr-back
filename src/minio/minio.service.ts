import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('minio.endPoint'),
      port: this.configService.get('minio.port'),
      useSSL: this.configService.get('minio.useSSL'),
      accessKey: this.configService.get('minio.accessKey'),
      secretKey: this.configService.get('minio.secretKey'),
      transportAgent: new https.Agent({
        rejectUnauthorized: true,
        ca: [
          fs.readFileSync('/app/crt/root.crt'),
          fs.readFileSync('/app/crt/chain.crt'),
        ],
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

  async uploadFile(file: Express.Multer.File): Promise<void> {
    const decodedFileName = decodeURIComponent(file.originalname);
    await this.minioClient.putObject(
      this.bucket,
      decodedFileName,
      file.buffer,
      file.size,
    );
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<void> {
    if (!files?.length) {
      throw new BadRequestException('No files provided');
    }

    try {
      const uploadPromises = files.map((file) => this.uploadFile(file));
      await Promise.all(uploadPromises);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to upload one or more files',
      );
    }
  }

  async downloadFile(objectName: string): Promise<Buffer> {
    try {
      const stream = await this.minioClient.getObject(this.bucket, objectName);
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    } catch (error) {
      this.logger.error(`Error downloading file: ${error.message}`);
      throw error;
    }
  }

  async downloadFiles(objectNames: string[]): Promise<Buffer[]> {
    const downloadPromises = objectNames.map((objectName) =>
      this.downloadFile(objectName),
    );
    return Promise.all(downloadPromises);
  }

  async deleteFile(objectName: string): Promise<boolean> {
    try {
      await this.minioClient.removeObject(this.bucket, objectName);
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }
}
