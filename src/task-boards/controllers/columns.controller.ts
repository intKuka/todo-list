import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ColumnsService } from '../services/columns.service';
import { GetUserMetadata } from 'src/common/decorators/get-user-metadata.decorator';
import { CreateColumnDto } from '../dto/columns/create-column.dto';
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
import { GetSlug } from 'src/common/pipes/get-slug.pipe';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateColumnDto } from '../dto/columns/update-column.dto';
import { UpdateColumnPositionDto } from '../dto/columns/update-column-position.dto';
import { ColumnDto } from '../dto/columns/column.dto';
import { AssignSlugInBody } from 'src/common/pipes/assign-slug-to-body.pipe';

@ApiBearerAuth()
@ApiTags('Columns')
@UseGuards(AuthGuard)
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
    const result = await this.columns.createColumnInProject(
      { slug: projectSlug, userId },
      slug,
      dto,
    );
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
    @Param('label', GetSlug) slug: string,
    @Body() dto: UpdateColumnPositionDto,
  ) {
    const result = await this.columns.changeColumnPositionInProject(
      { slug, projectSlug, userId },
      dto,
    );
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
    @Param('label', GetSlug) slug: string,
    @Body(new AssignSlugInBody('label')) dto: UpdateColumnDto,
  ) {
    await this.columns.updateCoumnInProject({ slug, projectSlug, userId }, dto);
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
    @Param('label', GetSlug) slug: string,
  ) {
    const result = await this.columns.deleteColumnInProject({
      slug,
      projectSlug,
      userId,
    });
    return result;
  }
}
