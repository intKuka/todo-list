import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignedInDto } from './dto/signed-in.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a user' })
  @ApiCreatedResponse({
    type: SignedInDto,
    description: 'Returns access token',
  })
  @ApiConflictResponse({ description: 'Email is already exists' })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @Post('signup')
  async signUp(@Body() singUpDto: SignUpDto) {
    return await this.authService.signup(singUpDto);
  }

  @ApiOperation({ summary: 'Login as an existing user' })
  @ApiCreatedResponse({
    type: SignedInDto,
    description: 'Returns access token',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signin(signInDto);
  }
}
