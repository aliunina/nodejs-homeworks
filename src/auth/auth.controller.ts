import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dtos/login.dto.js';
import ms, { type StringValue } from 'ms';
import type { Response } from 'express';
import { toUserResponseDto } from '../users/dtos/user-response.dto.js';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {}

    @Post('login')
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.login(body);
        const tokenMaxAge = ms(
            (this.configService.get<string>('JWT_EXPIRES_IN') ||
                '7d') as StringValue
        );

        res.cookie('token', result.jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: tokenMaxAge,
        });

        return toUserResponseDto(result.user);
    }
}
