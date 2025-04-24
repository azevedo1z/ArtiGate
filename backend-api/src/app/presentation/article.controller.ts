import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateArticleService } from '../application/services/article/createArticle.service';
import { CreateArticleDTO } from '../application/dtos/article/createArticle.dto';
import { GetArticleService } from '../application/services/article/getArticle.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly createArticleService: CreateArticleService,
    private readonly getArticleService: GetArticleService
  ) {}

  @Post('create')
  @ApiBearerAuth()
  async create(@Body() data: CreateArticleDTO) {
    return this.createArticleService.execute(data);
  }

  @Get('allArticles')
  @ApiBearerAuth()
  async getAll() {
    return this.getArticleService.getAll();
  }

  @Get('allAuthors')
  @ApiBearerAuth()
  async getAllAuthors() {
    return this.getArticleService.getAllAuthors();
  }

  @Get(':id')
  @ApiBearerAuth()
  async getById(@Param('id') id: string) {
    return this.getArticleService.getById(id);
  }

  @Get('authorsBy/:articleId')
  @ApiBearerAuth()
  async getAuthorByArticleId(@Param('articleId') articleId: string) {
    return this.getArticleService.getByAuthorId(articleId);
  }
}
