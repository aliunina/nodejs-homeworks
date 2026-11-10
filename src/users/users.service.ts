import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import type { CreateUserDto } from './dtos/create-user.dto.js';
import type { UpdateUserDto } from './dtos/update-user.dto.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import User from "./entities/user.entity.js";
import UserListQueryDto from "./dtos/user-list-query.dto.js";

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async createUser(createData: CreateUserDto) {
        const existingUser = await this.usersRepository.findOneBy({
            email: createData.email,
        });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const newUser = await User.create(createData);

        return this.usersRepository.save(newUser);
    }

    async findUserById(userId: string) {
        const user = await this.usersRepository.findOneBy({
            id: userId,
        });

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

        await this.usersRepository.update(
            userId,
            updateData // TODO
        );

        const updatedUser = await this.usersRepository.findOneBy({
            id: userId,
        });

        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }

        this.eventEmitter.emit('profileUpdated', updatedUser);

        return updatedUser;
    }

    async findUsersWithFirstPostAndLikes(query: UserListQueryDto) {
        return await this.usersRepository.findWithFirstPostsAndLikes(query);
    }
}
