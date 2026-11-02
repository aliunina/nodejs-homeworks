import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @MinLength(1)
    @MaxLength(254)
    title: string;

    @IsString()
    @MinLength(1)
    @MaxLength(5000)
    description: string;
}