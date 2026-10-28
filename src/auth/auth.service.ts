import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service.js';
import { User } from '../user/entities/user.entity.js';
import { CreateUserDto, LoginDto } from '../user/dto/create-user.dto.js';
import { REFRESH_TTL_S } from './auth.constants.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) { }

    async login(dto: LoginDto) {
        const user = await this.userService.findByEmailWithPassword(dto.email.trim().toLowerCase());
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new UnauthorizedException('Invalid email or password');
        }
        return this.createSession(user);
    }

    async signup(dto: CreateUserDto) {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.userService.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            passwordHash,
        });
        return this.createSession(user);
    }


    async createSession(user: User) {
        // access token uses the module's default secret and 15m expiry
        const accessToken = await this.jwt.signAsync({
            sub: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        });

        // refresh token: minimal payload, own secret, longer expiry
        const refreshToken = await this.jwt.signAsync(
            { sub: user.id },
            {
                secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
                expiresIn: REFRESH_TTL_S,
            },
        );

        return {
            accessToken,
            refreshToken,
            user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
        };
    }

    async refresh(rawToken?: string) {
        if (!rawToken) throw new UnauthorizedException();

        let payload: { sub: string };
        try {
            payload = await this.jwt.verifyAsync<{ sub: string }>(rawToken, {
                secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
            });
        } catch {
            throw new UnauthorizedException();
        }

        // reload from the DB so name/email changes propagate and deleted users can't refresh
        const user = await this.userService.findById(payload.sub);
        if (!user) throw new UnauthorizedException();
        return this.createSession(user);
    }


}