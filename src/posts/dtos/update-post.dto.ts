import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePostDto {
    @IsString()
    @MinLength(1)
    @MaxLength(254)
    @IsOptional()
    title?: string;

    @IsString()
    @MinLength(1)
    @MaxLength(5000)
    @IsOptional()
    description?: string;
}
