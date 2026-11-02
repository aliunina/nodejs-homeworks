import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

export async function readJsonFile<T>(filePath: string): Promise<T[]> {
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

        return JSON.parse(content) as T[];
    } catch (error) {
        if (
            error instanceof Error &&
            'code' in error &&
            error.code === 'ENOENT'
        ) {
            return [];
        }

        throw error;
    }
}

export async function writeJsonFile<T>(
    filePath: string,
    data: T[]
): Promise<void> {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    await pipeline(
        Readable.from([JSON.stringify(data, null, 2)]),
        fs.createWriteStream(filePath)
    );
}
