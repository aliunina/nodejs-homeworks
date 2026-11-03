import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import type { CreateUserDto } from './dtos/create-user.dto.js';
import User from './user.entity.js';
import type { UpdateUserDto } from './dtos/update-user.dto.js';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async createUser(createData: CreateUserDto) {
        const existingUser = await this.usersRepository.findByEmail(
            createData.email
        );

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const newUser = await User.create(createData);

        return this.usersRepository.save(newUser);
    }

    async findUserById(userId: string) {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async updateUser(userId: string, updateData: UpdateUserDto) {
        const hasUpdate = Object.values(updateData).some(
            (value) => value !== undefined
        );

        if (!hasUpdate) {
            throw new BadRequestException('Request body can not be empty');
        }

        const updatedUser = await this.usersRepository.updateById(
            userId,
            updateData
        );

        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }

        this.eventEmitter.emit('profileUpdated', updatedUser);

        return updatedUser;
    }
}
