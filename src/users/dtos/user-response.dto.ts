import type User from '../entities/user.entity.js';

export class UserResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export function toUserResponseDto(user: User): UserResponseDto {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    };
}
