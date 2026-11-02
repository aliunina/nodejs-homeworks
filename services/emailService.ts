import { MailtrapClient } from 'mailtrap';
import User from '../models/User.js';
import z from 'zod';

const client = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN ?? '',
});

const senderSchema = z.object({
    MAIL_FROM_ADDRESS: z.email(),
    MAIL_FROM_NAME: z.string().min(1),
});

const sender = senderSchema.parse(process.env);

export async function sendProfileUpdatedEmail(user: User) {
    await client.send({
        from: {
            email: sender.MAIL_FROM_ADDRESS,
            name: sender.MAIL_FROM_NAME,
        },
        to: [{ email: user.email }],
        subject: 'Your user profile was updated',
        text: `Hello ${user.firstName}, your user profile was successfully updated.`,
    });
}
