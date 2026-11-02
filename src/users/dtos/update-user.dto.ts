import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsOptional()
    firstName: string;

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsOptional()
    lastName: string;
}