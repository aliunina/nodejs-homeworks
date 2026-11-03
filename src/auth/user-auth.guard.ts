import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
    type CanActivate,
    type ExecutionContext,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt, { type JwtPayload } from 'jsonwebtoken';

@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        try {
            const req = context.switchToHttp().getRequest();
            const token = req.cookies?.token;

            if (!token || typeof token !== 'string') {
                throw new UnauthorizedException('Not authorized');
            }

            const secret = this.configService.getOrThrow<string>('JWT_SECRET');

            if (!secret) {
                throw new InternalServerErrorException(
                    'JWT secret is not configured'
                );
            }

            const decodedToken = jwt.verify(token, secret) as JwtPayload;

            if (!decodedToken.id || typeof decodedToken.id !== 'string') {
                throw new UnauthorizedException(
                    'Wrong JWT Token, you need to log in again'
                );
            }

            req.user = {
                id: decodedToken.id,
            };

            return true;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedException(
                    'Wrong JWT Token, you need to log in again'
                );
            }

            throw error;
        }
    }
}
