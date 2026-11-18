import {
    BadRequestException,
    Injectable,
    type CanActivate,
    type ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class HasUpdateGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();
        const body: unknown = req.body;

        const hasUpdate =
            body !== null &&
            typeof body === 'object' &&
            !Array.isArray(body) &&
            Object.values(body).some((value) => value !== undefined);

        if (!hasUpdate) {
            throw new BadRequestException('Request body can not be empty');
        }

        return true;
    }
}
