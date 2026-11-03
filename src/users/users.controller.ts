import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import type { AuthenticatedRequest } from '../types/express.js';
import { toUserResponseDto } from './dtos/user-response.dto.js';
import { UserAuthGuard } from '../auth/user-auth.guard.js';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() body: CreateUserDto) {
        const user = await this.usersService.createUser(body);

        return toUserResponseDto(user);
    }

    @Get('me')
    @UseGuards(UserAuthGuard)
    async getCurrentUser(@Req() req: AuthenticatedRequest) {
        const userId = req.user.id;

        const user = await this.usersService.findUserById(userId);

        return toUserResponseDto(user);
    }

    @Patch('me')
    @UseGuards(UserAuthGuard)
    async updateCurrentUser(
        @Body() body: UpdateUserDto,
        @Req() req: AuthenticatedRequest
    ) {
        const userId = req.user.id;

        const user = await this.usersService.updateUser(userId, body);

        return toUserResponseDto(user);
    }
}
