import fs from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

const USERS_DATA_PATH = path.join(process.cwd(), 'data/users.json');
const USERS_BACKUP_DIR = path.join(process.cwd(), 'backups');

if (!fs.existsSync(USERS_BACKUP_DIR)) {
    fs.mkdirSync(USERS_BACKUP_DIR, { recursive: true });
}

const timestamp = new Date().toISOString().split('T')[0].replace(/[:.]/g, '-');
const userBackupPath = path.join(USERS_BACKUP_DIR, `users-${timestamp}.json`);

const readStream = fs.createReadStream(USERS_DATA_PATH, {
    encoding: 'utf-8',
});
const writeStream = fs.createWriteStream(userBackupPath);

readStream.on('error', (error) => {
    logger.error(`Error occured while reading users.json: ${error.message}`);
});

writeStream.on('error', (error) => {
    logger.error(`Error occured while writing backup: ${error.message}`);
});

writeStream.on('finish', () => {
    logger.info(`Users backup is saved in ${userBackupPath}`);
});

readStream.pipe(writeStream);
