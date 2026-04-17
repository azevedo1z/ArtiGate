import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PaginationDTO } from '../../shared/dtos/pagination.dto';
import { CreateArticleService } from '../../application/services/article/createArticle.service';
import { CreateArticleDTO } from '../../application/dtos/article/createArticle.dto';
import { GetArticleService } from '../../application/services/article/getArticle.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from '../../infrastructure/services/authGuard.service';
import { DeleteArticleService } from '../../application/services/article/deleteArticle.service';
import { UpdateArticleService } from '../../application/services/article/updateArticle.service';
import { UpdateArticleDTO } from '../../application/dtos/article/updateArticle.dto';

@Controller('article')
@ApiBearerAuth()
@UseGuards(AuthGuardService)
export class ArticleController {
  constructor(
    private readonly createArticleService: CreateArticleService,
    private readonly getArticleService: GetArticleService,
    private readonly deleteArticleService: DeleteArticleService,
    private readonly updateArticleService: UpdateArticleService
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateArticleDTO) {
    return await this.createArticleService.execute(data);
  }

  @Put('update')
  async update(@Body() data: UpdateArticleDTO) {
    return await this.updateArticleService.execute(data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deleteArticleService.execute(id);
  }

  @Get('all')
  async getAll(@Query() pagination: PaginationDTO) {
    return await this.getArticleService.getAll(pagination);
  }

  @Get('author/:authorId')
  async getByAuthorId(@Param('authorId', ParseUUIDPipe) authorId: string) {
    return await this.getArticleService.getByAuthorId(authorId);
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.getArticleService.getById(id);
  }
}
