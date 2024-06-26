import { ApiProperty } from '@nestjs/swagger';

export class SignedInDto {
  constructor(token) {
    this.accesToken = token;
  }
  @ApiProperty({ description: 'your bearer token' })
  accesToken: string;
}
