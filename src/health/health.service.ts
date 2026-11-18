import { Injectable } from '@nestjs/common';
import fs from 'fs/promises';
import path from 'path';

@Injectable()
export class HealthService {
    async getAppVersion() {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const { version } = JSON.parse(
            await fs.readFile(packageJsonPath, 'utf8')
        );

        return version;
    }
}
