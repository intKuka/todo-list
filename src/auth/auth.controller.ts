import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse()
  @Post('signup')
  async signUp(@Body() singUpDto: SignUpDto) {
    return await this.authService.signup(singUpDto);
  }
  @ApiOkResponse()
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signin(signInDto);
  }
}
