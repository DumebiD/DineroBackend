import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserService } from '../user/user.service.js';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module.js';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[UserModule, JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          secret: config.getOrThrow<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1h' },
        }),
      }),],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
