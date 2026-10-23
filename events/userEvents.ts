import eventBus from './eventBus.js';
import { sendUserUpdatedEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';

eventBus.on('userUpdated', async (updatedUser) => {
    try {
        await sendUserUpdatedEmail(updatedUser);

        logger.info(`Email is sent to ${updatedUser.email}`);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : undefined;

        logger.error({
            message: `Failed to send email: ${message}`,
            stack,
        });
    }
});
