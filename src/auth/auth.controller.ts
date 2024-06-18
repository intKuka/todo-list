import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signin')
  // TODO: varify body
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signin(signInDto);
  }
}
