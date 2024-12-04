import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  UnauthorizedException,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { MinioService } from './minio.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// DTO 클래스에 userId 필드 추가
export class PresignedUrlDto {
  fileName: string;
  userId: string; // 사용자 ID를 body에서 받을 수 있도록 필드 추가
}

export class DeleteFileDto {
  userId: string;
}

@Controller('minio')
@UseGuards(JwtAuthGuard)
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('presigned-url')
  async getUploadUrl(@Body() body: PresignedUrlDto) {
    // body에서 직접 userId를 받아옴
    const { userId, fileName } = body;

    // 사용자별로 고유한 경로 생성
    const objectName = `users/${userId}/files/${Date.now()}-${fileName}`;

    try {
      const url = await this.minioService.generateUploadUrl(objectName);
      return {
        url,
        objectName,
        expiresIn: 3600, // 60 * 60 = 1시간
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to generate upload URL');
    }
  }

  @Get('file/:objectName')
  async getDownloadUrl(@Param('objectName') objectName: string) {
    try {
      console.log('called');
      const url = await this.minioService.generateDownloadUrl(objectName);
      return {
        url,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to generate download URL');
    }
  }

  @Delete('file/:objectName')
  async deleteFile(
    @Body() body: DeleteFileDto,
    @Param('objectName') objectName: string,
  ) {
    const { userId } = body;

    // 파일 접근 권한 검증
    if (!objectName.startsWith(`users/${userId}/`)) {
      throw new UnauthorizedException(
        'You do not have permission to delete this file',
      );
    }

    try {
      const deleted = await this.minioService.deleteFile(objectName);
      if (!deleted) {
        throw new NotFoundException('File not found');
      }
      return {
        message: 'File deleted successfully',
        objectName,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to delete file');
    }
  }
}
