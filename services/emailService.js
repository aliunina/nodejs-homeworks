import { MailtrapClient } from 'mailtrap';

const client = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN,
});
const sender = {
    email: process.env.MAIL_FROM_ADDRESS,
    name: process.env.MAIL_FROM_NAME,
};

export async function sendProfileUpdatedEmail(user) {
    await client.send({
        from: sender,
        to: [{ email: user.email }],
        subject: 'Your user profile was updated',
        text: `Hello ${user.firstName}, your user profile was successfully updated.`,
    });
}
