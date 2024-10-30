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
import { SuccessResult, UserDto } from '@app/common';
import { UserService } from './user.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private users: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({
    type: SuccessResult<[UserDto]>,
    description: 'List of all users',
  })
  async findAllUsers() {
    return await this.users.findAllUsers();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({
    type: SuccessResult,
    description: 'Deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiParam({ name: 'id', description: 'user id' })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.users.deleteUserById(id);
  }
}
