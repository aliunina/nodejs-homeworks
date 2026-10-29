import fs from 'fs/promises';
import path from 'path';

export async function getAppVersion() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const { version } = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

    return version;
}
