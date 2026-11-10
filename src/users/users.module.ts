import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { UsersRepository } from './users.repository.js';
import { UserAuthGuard } from '../auth/user-auth.guard.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';

@Module({
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, UserAuthGuard],
    exports: [UsersService, UsersRepository],
    imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
