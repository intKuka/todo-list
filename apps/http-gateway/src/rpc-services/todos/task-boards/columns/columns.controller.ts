import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GetSlug } from '../../pipes/get-slug.pipe';
import { ColumnDto } from '@app/todos/models/columns/dto/column.dto';
import { GetUserMetadata } from '../../decorators/get-user-metadata.decorator';
import { AssignSlugInBody } from '../../pipes/assign-slug-to-body.pipe';
import { UpdateColumnDto } from '@app/todos/models/columns/dto/update-column.dto';
import { UpdateColumnPositionDto } from '@app/todos/models/columns/dto/update-column-position.dto';
import { ColumnsService } from 'apps/todo-service/src/columns/columns.service';
import { CreateColumnDto } from '@app/todos/models/columns/dto/create-column.dto';

@ApiBearerAuth()
@ApiTags('Columns')
@Controller('columns')
export class ColumnsController {
  constructor(private columns: ColumnsService) {}

  @ApiOperation({ summary: 'Create column in project' })
  @ApiCreatedResponse({
    type: [ColumnDto],
    description: 'List of all project columns with new one included',
  })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @ApiNotFoundResponse({ description: 'Project with provided title not found' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @Post()
  async createColumnInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Body('label', GetSlug) slug: string,
    @Body() dto: CreateColumnDto,
  ) {
    const result = await this.columns.createColumnInProject({
      projectSlug,
      userId,
      column: dto,
    });
    return result;
  }

  @ApiOperation({ summary: 'Change column position in project' })
  @ApiOkResponse({
    type: [ColumnDto],
    description: 'List of all project columns with updated positions',
  })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @ApiNotFoundResponse({ description: 'Column not found' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @ApiParam({ name: 'label', description: 'column slug or actual label' })
  @Patch(':label/position')
  async changeColumnPositionInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Param('label', GetSlug) columnSlug: string,
    @Body() dto: UpdateColumnPositionDto,
  ) {
    const result = await this.columns.changeColumnPositionInProject({
      projectSlug,
      userId,
      columnSlug,
      toPosition: dto.position,
    });
    return result;
  }

  @ApiOperation({ summary: 'Update column in project' })
  @ApiNoContentResponse({ description: 'Updated successfully' })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @ApiNotFoundResponse({ description: 'Column not found' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @ApiParam({ name: 'label', description: 'column slug or actual label' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':label')
  async updateColumnInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Param('label', GetSlug) columnSlug: string,
    @Body(new AssignSlugInBody('label')) dto: UpdateColumnDto,
  ) {
    await this.columns.updateCoumnInProject({
      projectSlug,
      userId,
      columnSlug,
      update: dto,
    });
  }

  @ApiOperation({ summary: 'Delete column in project' })
  @ApiOkResponse({
    type: [ColumnDto],
    description: 'List of all project columns with updated order',
  })
  @ApiNotFoundResponse({ description: 'Column not found' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @ApiParam({ name: 'label', description: 'column slug or actual label' })
  @Delete(':label')
  async deleteColumnInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Param('label', GetSlug) columnSlug: string,
  ) {
    const result = await this.columns.deleteColumnInProject({
      columnSlug,
      projectSlug,
      userId,
    });
    return result;
  }
}
