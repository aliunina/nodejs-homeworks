import PageQueryDto from '../../common/page-query.dto.js';
import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export default class UserListQueryDto extends PageQueryDto {
    @IsOptional()
    @IsIn(['firstName', 'lastName', 'email'])
    sortBy: 'firstName' | 'lastName' | 'email' = 'lastName';

    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    firstName: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    lastName: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(254)
    email: string;
}
