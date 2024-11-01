import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Authorization,
  CreateUserDto,
  SignedInDto,
  SignInDto,
} from '@app/common';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @Authorization(false)
  @ApiOperation({ summary: 'Register a user' })
  @ApiCreatedResponse({
    type: SignedInDto,
    description: 'Returns access token',
  })
  @ApiConflictResponse({ description: 'Email is already exists' })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  async register(@Body() dto: CreateUserDto) {
    return await this.auth.signUp(dto);
  }

  @Post('login')
  @Authorization(false)
  @ApiOperation({ summary: 'Login as an existing user' })
  @ApiCreatedResponse({
    type: SignedInDto,
    description: 'Returns access token',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() dto: SignInDto) {
    return this.auth.signIn(dto);
  }
}
