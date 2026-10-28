import eventBus from './eventBus.js';
import { sendProfileUpdatedEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';

eventBus.on('profileUpdated', async (updatedUser) => {
    try {
        await sendProfileUpdatedEmail(updatedUser);

        logger.info(`Email is sent to ${updatedUser.email}`);
    } catch (error) {
        logger.error({
            message: `Failed to send email: ${error.message}`,
            stack: error.stack,
        });
    }
});
