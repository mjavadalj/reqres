import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    name: 'email',
    example: 'javad@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    example: '1234',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(3)
  password: string;
}
