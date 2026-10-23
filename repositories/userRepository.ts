import path from 'path';
import { User, UserProps } from '../models/User.js';
import { readJsonFile, writeJsonFile } from '../utils/jsonFile.js';

const USERS_DATA_PATH = path.join(process.cwd(), 'data/users.json');

export async function findByEmail(email: string) {
    const users = await getAll();

    return users.find((user) => user.email === email) ?? null;
}

export async function findById(id: string) {
    const users = await getAll();

    return users.find((user) => user.id === id) ?? null;
}

export async function getAll() {
    const users = await readJsonFile<UserProps>(USERS_DATA_PATH);

    return users.map((user) => new User(user));
}

export async function save(user: User) {
    const users = await getAll();

    users.push(user);
    await saveAll(users);

    return user;
}

export async function saveAll(users: User[]) {
    await writeJsonFile(USERS_DATA_PATH, users);
}

export async function updateById(id: string, updateData: Partial<UserProps>) {
    const users = await getAll();
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
        return null;
    }

    const current = users[index].toJSON();
    const definedUpdates = Object.fromEntries(
        Object.entries(updateData).filter(([, value]) => value !== undefined)
    );
    const updatedUser = new User({
        ...current,
        ...definedUpdates,
        id: current.id,
    });

    users[index] = updatedUser;
    await saveAll(users);

    return updatedUser;
}
