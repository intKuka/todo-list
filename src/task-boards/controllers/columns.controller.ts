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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetSlug } from 'src/common/pipes/get-slug.pipe';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { ProjectDto } from 'src/projects/dto/project.dto';
import { UpdateColumnDto } from '../dto/columns/update-column.dto';
import { UpdateColumnPositionDto } from '../dto/columns/update-column-position.dto';
import { ColumnDto } from '../dto/columns/column.dto';

@ApiBearerAuth()
@ApiTags('Task Boards')
@UseGuards(AuthGuard)
@Controller('columns')
export class ColumnsController {
  constructor(private columns: ColumnsService) {}

  @ApiCreatedResponse({ type: [ColumnDto] })
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

  @ApiOkResponse({ type: [ColumnDto] })
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

  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':label')
  async updateColumnInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Param('label', GetSlug) slug: string,
    @Body('label', GetSlug) newSlug: string,
    @Body() dto: UpdateColumnDto,
  ) {
    await this.columns.updateCoumnInProject(
      { slug, projectSlug, userId },
      newSlug,
      dto,
    );
  }

  @ApiOkResponse({ type: [ColumnDto] })
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
