import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({ type: UserDto })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOkResponse({ type: [UserDto] })
  @Get()
  async findAllUsers(): Promise<UserDto[]> {
    return await this.usersService.fintAllUsers();
  }
}
