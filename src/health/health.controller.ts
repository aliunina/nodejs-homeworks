import { Controller, Get, Header } from '@nestjs/common';
import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Get()
    @Header(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
    )
    async readHealth() {
        const version = await this.healthService.getAppVersion();

        return {
            version
        };
    }
}
