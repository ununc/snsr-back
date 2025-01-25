import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UploadedFiles,
  Body,
  UnauthorizedException,
  NotFoundException,
  UploadedFile,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { MinioService } from './minio.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';
import * as mime from 'mime-types';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

// 그리고 타입을 다음과 같이 수정
@Controller('minio')
@UseGuards(JwtAuthGuard)
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.minioService.uploadFile(file);
    } catch (error) {
      throw new UnauthorizedException('Failed to upload file');
    }
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      const uploadResults = await this.minioService.uploadFiles(files);
      return uploadResults;
    } catch (error) {
      throw new UnauthorizedException('Failed to upload files');
    }
  }

  @Get('download/:objectName')
  async downloadFile(
    @Param('objectName') objectName: string,
    @Res() res: Response,
  ) {
    try {
      const file = await this.minioService.downloadFile(
        decodeURIComponent(objectName),
      );

      const fileData = {
        data: file,
        type: mime.lookup(objectName) || 'application/octet-stream',
      };

      return res.json(fileData);
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }

  @Post('download/files')
  async downloadFiles(
    @Body() body: { objectNames: string[] },
    @Res() res: Response,
  ) {
    const files = await this.minioService.downloadFiles(body.objectNames);

    const filesData = files.map((buffer, index) => ({
      data: buffer,
      type: mime.lookup(body.objectNames[index]) || 'application/octet-stream',
    }));

    return res.json(filesData);
  }

  @Delete('remove/:objectName')
  async deleteFile(@Param('objectName') objectName: string) {
    try {
      const deleted = await this.minioService.deleteFile(
        decodeURIComponent(objectName),
      );
      if (!deleted) {
        throw new NotFoundException('File not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to delete file');
    }
  }
}
