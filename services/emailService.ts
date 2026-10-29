import { Address, MailtrapClient } from 'mailtrap';
import User from '../models/User.js';

const client = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN ?? '',
});

const sender: Address = {
    email: process.env.MAIL_FROM_ADDRESS as string,
    name: process.env.MAIL_FROM_NAME as string,
};

export async function sendProfileUpdatedEmail(user: User) {
    await client.send({
        from: sender,
        to: [{ email: user.email }],
        subject: 'Your user profile was updated',
        text: `Hello ${user.firstName}, your user profile was successfully updated.`,
    });
}
