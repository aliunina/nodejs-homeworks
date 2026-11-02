import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

export async function readJsonFile(filePath) {
    try {
        const chunks = [];
        const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

        for await (const chunk of readStream) {
            chunks.push(chunk);
        }

        const content = chunks.join('').trim();

        if (!content) {
            return [];
        }

        return JSON.parse(content);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }

        throw error;
    }
}

export async function writeJsonFile(filePath, data) {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    await pipeline(
        Readable.from([JSON.stringify(data, null, 2)]),
        fs.createWriteStream(filePath)
    );
}
