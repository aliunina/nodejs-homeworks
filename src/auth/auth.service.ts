import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import type { LoginDto } from './dtos/login.dto.js';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService
    ) {}

    async login(loginInput: LoginDto) {
        const user = await this.usersService.findUserByEmail(loginInput.email);

        if (!user || !(await user.comparePassword(loginInput.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const secret = this.configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new InternalServerErrorException(
                'JWT secret is not configured'
            );
        }

        const expiresIn = (this.configService.get<string>('JWT_EXPIRES_IN') ||
            '7d') as SignOptions['expiresIn'];

        const jwtToken = jwt.sign({ id: user.id }, secret, {
            expiresIn,
        });

        return {
            jwtToken,
            user: user.toJSON(),
        };
    }
}
