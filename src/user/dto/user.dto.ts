import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({})
  name: string;

  @ApiProperty({})
  job: string;
  @ApiProperty({})
  role: string;
  @ApiProperty({})
  _id: string;
  @ApiProperty({})
  createdAt: Date;
  @ApiProperty({})
  updatedAt: Date;
}
