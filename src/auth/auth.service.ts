import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import type { LoginDto } from './dtos/login.dto.js';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { UsersRepository } from '../users/users.repository.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly configService: ConfigService
    ) {}

    async login(loginInput: LoginDto) {
        const user = await this.usersRepository.findByEmail(loginInput.email);

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
            user,
        };
    }
}
