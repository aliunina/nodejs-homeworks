import { Injectable } from '@nestjs/common';
import { MailtrapClient } from 'mailtrap';
import type User from '../users/user.entity.js';
import { ConfigService } from '@nestjs/config';
import { isEmail } from 'class-validator';

@Injectable()
export class EmailService {
    private client: MailtrapClient;

    private sender: {
        email: string;
        name: string;
    };

    constructor(private readonly configService: ConfigService) {
        const token = this.configService.getOrThrow<string>('MAILTRAP_TOKEN');
        const email =
            this.configService.getOrThrow<string>('MAIL_FROM_ADDRESS');
        const name = this.configService.getOrThrow<string>('MAIL_FROM_NAME');

        if (!isEmail(email) || name.trim().length === 0) {
            throw new Error('Mail sender is not configured');
        }

        this.client = new MailtrapClient({ token });
        this.sender = { email, name: name.trim() };
    }

    async sendProfileUpdatedEmail(user: User) {
        await this.client.send({
            from: this.sender,
            to: [{ email: user.email }],
            subject: 'Your user profile was updated',
            text: `Hello ${user.firstName}, your user profile was successfully updated.`,
        });
    }
}
