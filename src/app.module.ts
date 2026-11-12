import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module.js';
import { HealthModule } from './health/health.module.js';
import { PostsModule } from './posts/posts.module.js';
import { AuthModule } from './auth/auth.module.js';
import { EmailModule } from './email/email.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { UserAuthGuard } from './auth/user-auth.guard.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        EventEmitterModule.forRoot(),
        UsersModule,
        HealthModule,
        PostsModule,
        AuthModule,
        EmailModule,
    ],
    providers: [{ provide: APP_GUARD, useClass: UserAuthGuard }],
})
export class AppModule {}
