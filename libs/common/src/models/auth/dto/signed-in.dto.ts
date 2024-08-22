import { ApiProperty } from '@nestjs/swagger';

export class SignedInDto {
  constructor(token: string) {
    this.accesToken = token;
  }
  @ApiProperty({ description: 'your bearer token' })
  accesToken: string;
}
