import { MailtrapClient } from 'mailtrap';
import User from '../models/User.js';

const client = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN ?? '',
});

const sender = {
    email: 'hello@demomailtrap.co',
    name: 'Mailtrap Test',
};

export async function sendUserUpdatedEmail(user: User) {
    await client.send({
        from: sender,
        to: [{ email: user.email }],
        subject: 'Your user profile was updated',
        text: `Hello ${user.firstName}, your user profile was successfully updated.`,
    });
}
