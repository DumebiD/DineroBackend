import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { COOKIE_NAME } from "./auth.constants.js";
import { FastifyRequest } from "fastify";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<FastifyRequest & { user?: JwtPayload }>();
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) throw new UnauthorizedException();

    try {
      req.user = await this.jwt.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}

// auth.guard.ts
export type JwtPayload = {
  sub: string;        // user id
  email: string;
  firstName: string;
  lastName: string;
  iat: number;        // issued at (seconds), added by jwt.sign
  exp: number;        // expiry (seconds), added by jwt.sign
};