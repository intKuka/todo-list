import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthGuard)
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

  @ApiNoContentResponse({ type: [UserDto] })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.usersService.deleteUser(id);
  }
}
