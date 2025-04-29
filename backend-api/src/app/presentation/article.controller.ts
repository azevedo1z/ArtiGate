import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateArticleService } from '../application/services/article/createArticle.service';
import { CreateArticleDTO } from '../application/dtos/article/createArticle.dto';
import { GetArticleService } from '../application/services/article/getArticle.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from '../infrastructure/authGuard.service';
import { DeleteArticleService } from '../application/services/article/deleteArticle.service';

@Controller('article')
@ApiBearerAuth()
@UseGuards(AuthGuardService)
export class ArticleController {
  constructor(
    private readonly createArticleService: CreateArticleService,
    private readonly getArticleService: GetArticleService,
    private readonly deleteArticleService: DeleteArticleService
  ) {}

  @Post('create')
  async create(@Body() data: CreateArticleDTO) {
    try {
      return await this.createArticleService.execute(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete('delete')
  async delete(@Body() id: string) {
    try {
      return await this.deleteArticleService.execute(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('allArticles')
  async getAll() {
    try {
      return await this.getArticleService.getAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('allAuthors')
  async getAllAuthors() {
    try {
      return await this.getArticleService.getAllAuthors();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      return await this.getArticleService.getById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('authorsBy/:articleId')
  async getAuthorByArticleId(@Param('articleId') articleId: string) {
    try {
      return await this.getArticleService.getByAuthorId(articleId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
