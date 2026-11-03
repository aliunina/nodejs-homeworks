import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service.js';
import { OnEvent } from '@nestjs/event-emitter';
import type User from '../users/user.entity.js';
import logger from '../utils/logger.js';

@Injectable()
export class ProfileUpdatedListener {
    constructor(private readonly emailService: EmailService) {}

    @OnEvent('profileUpdated')
    async handle(user: User) {
        try {
            await this.emailService.sendProfileUpdatedEmail(user);

            logger.info(`Email is sent to ${user.email}`);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Unknown error';
            const stack = error instanceof Error ? error.stack : undefined;

            logger.error({
                message: `Failed to send email: ${message}`,
                stack,
            });
        }
    }
}
