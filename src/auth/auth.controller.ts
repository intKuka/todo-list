import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignedInDto } from './dto/signed-in.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({ type: SignedInDto })
  @Post('signup')
  async signUp(@Body() singUpDto: SignUpDto) {
    return await this.authService.signup(singUpDto);
  }
  @ApiCreatedResponse({ type: SignedInDto })
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signin(signInDto);
  }
}
