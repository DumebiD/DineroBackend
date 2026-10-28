import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CookieSerializeOptions } from '@fastify/cookie';
import { AuthService } from './auth.service.js';
import { AuthGuard, type JwtPayload } from './auth.guard.js';
import { CreateUserDto, LoginDto } from '../user/dto/create-user.dto.js';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor.js';
import {
  ACCESS_COOKIE_PATH,
  ACCESS_TTL_S,
  COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_PATH,
  REFRESH_TTL_S,
} from './auth.constants.js';

type Session = Awaited<ReturnType<AuthService['login']>>;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) { }

  private cookieOptions(): CookieSerializeOptions {
    const sameSite = this.config.get<'lax' | 'strict' | 'none'>('COOKIE_SAME_SITE', 'lax');
    return {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production' || sameSite === 'none',
      sameSite,
    };
  }

  // sets both cookies and returns the user for the response body
  private respond(res: FastifyReply, { accessToken, refreshToken, user }: Session) {
    res.setCookie(COOKIE_NAME, accessToken, {
      ...this.cookieOptions(),
      path: ACCESS_COOKIE_PATH,
      maxAge: ACCESS_TTL_S, // seconds in @fastify/cookie
    });
    res.setCookie(REFRESH_COOKIE_NAME, refreshToken, {
      ...this.cookieOptions(),
      path: REFRESH_COOKIE_PATH,
      maxAge: REFRESH_TTL_S,
    });
    return user;
  }

  // path (and other options) must match what was used to set the cookies
  private clearSession(res: FastifyReply) {
    res.clearCookie(COOKIE_NAME, { ...this.cookieOptions(), path: ACCESS_COOKIE_PATH });
    res.clearCookie(REFRESH_COOKIE_NAME, { ...this.cookieOptions(), path: REFRESH_COOKIE_PATH });
  }

  // @UseInterceptors(LoggingInterceptor)
  @Post('signup')
  async signup(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: FastifyReply) {
    return this.respond(res, await this.authService.signup(dto));
  }

  // @UseInterceptors(LoggingInterceptor)
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: FastifyReply) {
    return this.respond(res, await this.authService.login(dto));
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: FastifyRequest, @Res({ passthrough: true }) res: FastifyReply) {
    try {
      return this.respond(res, await this.authService.refresh(req.cookies[REFRESH_COOKIE_NAME]));
    } catch (e) {
      this.clearSession(res);
      throw e;
    }
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: FastifyReply) {
    this.clearSession(res);
  }

  // @UseInterceptors(LoggingInterceptor)
  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: FastifyRequest & { user: JwtPayload }) {
    const { sub, firstName, lastName, email } = req.user;
    return { id: sub, firstName, lastName, email };
  }
}