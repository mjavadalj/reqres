import { ApiProperty } from '@nestjs/swagger';

import { User } from '../user.schema';

export class GetAllUsersDto {
  @ApiProperty({
    name: 'page',
    example: 1,
  })
  page: number;
  @ApiProperty({
    name: 'per_page',
    example: 6,
  })
  per_page: number;

  @ApiProperty({
    name: 'total',
    example: 12,
  })
  total: number;
  @ApiProperty({
    name: 'total_pages',
    example: 2,
  })
  total_pages: number;
  @ApiProperty({
    name: 'data',
  })
  data: User[];
}
