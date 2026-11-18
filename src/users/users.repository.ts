import path from 'path';
import { Injectable } from '@nestjs/common';
import { readJsonFile, writeJsonFile } from '../utils/json-file.js';
import type { UpdateUserDto } from './dtos/update-user.dto.js';
import User, { type UserProps } from './user.entity.js';

@Injectable()
export class UsersRepository {
    private static readonly USERS_DATA_PATH = path.join(
        process.cwd(),
        'data/users.json'
    );

    constructor() {}

    async findByEmail(email: string) {
        const users = await this.getAll();

        return users.find((user) => user.email === email) ?? null;
    }

    async findById(id: string) {
        const users = await this.getAll();

        return users.find((user) => user.id === id) ?? null;
    }

    async getAll() {
        const users = await readJsonFile<UserProps>(
            UsersRepository.USERS_DATA_PATH
        );

        return users.map((user) => new User(user));
    }

    async save(user: User) {
        const users = await this.getAll();

        users.push(user);
        await this.saveAll(users);

        return user;
    }

    async saveAll(users: User[]) {
        await writeJsonFile(
            UsersRepository.USERS_DATA_PATH,
            users.map((user) => user.toPersistence())
        );
    }

    async updateById(id: string, updateData: UpdateUserDto) {
        const users = await this.getAll();
        const index = users.findIndex((user) => user.id === id);

        if (index === -1) {
            return null;
        }

        const current = users[index].toPersistence();
        const definedUpdates = Object.fromEntries(
            Object.entries(updateData).filter(
                ([, value]) => value !== undefined
            )
        );
        const updatedUser = new User({
            ...current,
            ...definedUpdates,
            id: current.id,
        });

        users[index] = updatedUser;
        await this.saveAll(users);

        return updatedUser;
    }
}
