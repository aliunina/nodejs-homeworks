import { Module } from '@nestjs/common';
import { EmailService } from './email.service.js';
import { ProfileUpdatedListener } from './profile-updated.listener.js';

@Module({
    providers: [EmailService, ProfileUpdatedListener],
})
export class EmailModule {}
