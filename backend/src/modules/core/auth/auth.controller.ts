import { Controller, Post, Body, Req, Res, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/core/auth/decorators/current-user.decorator';
import { Public } from 'src/modules/core/auth/decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  getMe(@CurrentUser('userId') userId: string) {
    return this.authService.getMe(userId);
  }

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;

    const result = await this.authService.login(loginDto, userAgent, ip);

    // Trả refresh token về trong HttpOnly Cookie
    if (result.data?.refreshToken) {
      res.cookie('refreshToken', result.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });
    }

    return result;
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Body('refreshToken') bodyToken?: string,
  ) {
    const refreshToken = req.cookies?.refreshToken || bodyToken;
    return this.authService.refreshToken(refreshToken);
  }

  @Public()
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body('refreshToken') bodyToken?: string,
  ) {
    const refreshToken = req.cookies?.refreshToken || bodyToken;
    res.clearCookie('refreshToken');
    return this.authService.logout(refreshToken);
  }

}


