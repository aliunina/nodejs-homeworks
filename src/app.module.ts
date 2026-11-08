import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module.js';
import { HealthModule } from './health/health.module.js';
import { PostsModule } from './posts/posts.module.js';
import { AuthModule } from './auth/auth.module.js';
import { EmailModule } from './email/email.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                autoLoadEntities: true,
                synchronize: false,
            }),
        }),
        EventEmitterModule.forRoot(),
        UsersModule,
        HealthModule,
        PostsModule,
        AuthModule,
        EmailModule,
    ],
})
export class AppModule {}
