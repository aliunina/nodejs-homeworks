import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dtos/login.dto.js';
import ms, { StringValue } from 'ms';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.login(body);
        const tokenMaxAge = ms(
            (process.env.JWT_EXPIRES_IN || '7d') as StringValue
        );

        res.cookie('token', result.jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: tokenMaxAge,
        });

        res.status(200).json(toUserResponseDTO(result.user));
    }
}
