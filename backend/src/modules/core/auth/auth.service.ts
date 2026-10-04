import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { DataSource, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { IResponse } from 'src/common/interface/response.interface';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { jwtConfig } from 'src/common/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSession } from './entities/user-session.entity';

export interface RegisterResponseData {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    userName: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    @InjectRepository(UserSession)
    private readonly sessionRepo: Repository<UserSession>,
  ) { }

  async register(dto: RegisterDto): Promise<IResponse<RegisterResponseData>> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('PASSWORD_NO_MATCH');
    }

    const existsEmail = await this.userService.findByEmail(dto.email);
    const existsUsername = await this.userService.findByUsername(dto.userName);

    if (existsUsername) {
      throw new BadRequestException('USERNAME_ALREADY_EXISTS');
    }
    if (existsEmail) {
      throw new BadRequestException('EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);

      const entity = userRepo.create({
        email: dto.email,
        hashedPassword: passwordHash,
        username: dto.userName,
        displayName: `${dto.firstName} ${dto.lastName}`,
      });

      return userRepo.save(entity);
    });

    return {
      success: true,
      code: 201,
      message: 'USER_REGISTERED_SUCCESSFULLY',
      data: {
        id: user.id,
        email: user.email,
        userName: user.username,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    };
  }

  async login(
    dto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<IResponse<LoginResponseData>> {
    // 1. Lấy input & tìm user
    const user = await this.userService.findByUsername(dto.username);

    if (!user) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    const passwordOk = await bcrypt.compare(dto.password, user.hashedPassword);
    if (!passwordOk) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    const payLoad: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payLoad, {
      secret: jwtConfig.secret,
      expiresIn: jwtConfig.accessTokenExpiresInLogin as any,
    });

    const refreshToken = this.jwtService.sign(payLoad, {
      secret: jwtConfig.refreshSecret,
      expiresIn: jwtConfig.accessTokenExpiresRefreshInLogin as any,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = this.sessionRepo.create({
      userId: user.id,
      refreshToken,
      expiresAt,
      userAgent,
      ipAddress,
    });
    await this.sessionRepo.save(session);

    return {
      code: 200,
      success: true,
      message: 'LOGIN_SUCCESS',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          userName: user.username,
        },
      },
    };
  }

  async refreshToken(token: string): Promise<IResponse<{ accessToken: string }>> {
    if (!token) {
      throw new UnauthorizedException('REFRESH_TOKEN_REQUIRED');
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token, {
        secret: jwtConfig.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('INVALID_OR_EXPIRED_REFRESH_TOKEN');
    }

    const session = await this.sessionRepo.findOne({
      where: { refreshToken: token, isRevoked: false },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('SESSION_EXPIRED_OR_REVOKED');
    }

    const newAccessToken = this.jwtService.sign(
      { sub: payload.sub, username: payload.username },
      {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.accessTokenExpiresInLogin as any,
      },
    );

    return {
      code: 200,
      success: true,
      message: 'TOKEN_REFRESHED_SUCCESSFULLY',
      data: { accessToken: newAccessToken },
    };
  }

  async logout(token: string): Promise<IResponse<null>> {
    if (token) {
      await this.sessionRepo.update({ refreshToken: token }, { isRevoked: true });
    }
    return {
      code: 200,
      success: true,
      message: 'LOGOUT_SUCCESSFUL',
      data: null,
    };
  }
}

