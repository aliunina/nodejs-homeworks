import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
    @IsEmail()
    @MaxLength(254)
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(50)
    password: string;

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    firstName: string;

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    lastName: string;
}