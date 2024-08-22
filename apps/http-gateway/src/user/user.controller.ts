import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../jwt-auth.guard';
import { SuccessResult, UserDto } from '@app/common';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('Users')
// @UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private users: UserService) {}

  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({
    type: SuccessResult<[UserDto]>,
    description: 'List of all users',
  })
  @Get()
  async findAllUsers() {
    return await this.users.findAllUsers();
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({
    type: SuccessResult,
    description: 'Deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiParam({ name: 'id', description: 'user id' })
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.users.deleteUserById(id);
  }
}
