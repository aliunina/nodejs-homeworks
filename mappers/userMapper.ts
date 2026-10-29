import User from '../models/User.js';
import UserResponseDTO from '../dtos/UserResponseDTO.js';

export function toUserResponseDTO(user: User): UserResponseDTO {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    };
}
