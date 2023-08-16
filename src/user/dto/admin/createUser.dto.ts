import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    name: 'name',
    example: 'javad',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    name: 'job',
    example: 'leader',
    required: true,
  })
  job: string;
}
