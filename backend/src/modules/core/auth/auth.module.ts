import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserSession } from './entities/user-session.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { RoleSettingEntity } from './entities/role_settings.entity';
import { PathSettingEntity } from './entities/path_setting.entity';
import { RolePathAssignmentEntity } from './entities/role_path_assignment.entity';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      UserSession,
      RoleSettingEntity,
      PathSettingEntity,
      RolePathAssignmentEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RoleGuard],
  exports: [AuthService, JwtAuthGuard, RoleGuard, PassportModule],
})
export class AuthModule {}


