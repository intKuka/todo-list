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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Directly create user' })
  @ApiOkResponse({ type: UserDto, description: 'Newly created user' })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({ type: [UserDto], description: 'List of all users' })
  @Get()
  async findAllUsers(): Promise<UserDto[]> {
    return await this.usersService.fintAllUsers();
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiNoContentResponse({
    type: [UserDto],
    description: 'Deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiParam({ name: 'id', description: 'user id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.usersService.deleteUser(id);
  }
}
