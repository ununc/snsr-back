import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseGuards,
  Patch,
  Request,
  Get,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { access_token, userInfo, menuList } =
      await this.authService.signIn(signInDto);
    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: true, // HTTPS를 사용하므로 true로 설정
      sameSite: 'none', // 크로스 사이트 요청 허용
    });
    res.status(HttpStatus.OK).json({ userInfo, menuList });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.userId, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-user-info')
  updateUserInfo(@Body() updateUserInfoDto: UpdateUserInfoDto) {
    return this.authService.updateUserInfo(updateUserInfoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard) // JWT 토큰 유효성 검사
  async validateToken() {
    return {
      isValid: true,
    };
  }

  @Get('adress')
  async getRelativeAddress(
    @Query('daechung') daechung: string = 'true',
    @Query('sarang') sarang: string = '새가족',
  ) {
    return this.authService.findRelativeAddress(daechung === 'true', sarang);
  }
}