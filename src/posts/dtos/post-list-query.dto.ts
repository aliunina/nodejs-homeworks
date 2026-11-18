import {
    IsIn,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import PageQueryDto from '../../common/page-query.dto.js';

export default class PostListQueryDto extends PageQueryDto {
    @IsOptional()
    @IsIn(['createdOn', 'title'])
    sortBy: 'createdOn' | 'title' = 'createdOn';

    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(254)
    title: string;
}
