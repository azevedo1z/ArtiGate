import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateArticleService } from '../application/services/article/createArticle.service';
import { CreateArticleDTO } from '../application/dtos/article/createArticle.dto';
import { GetArticleService } from '../application/services/article/getArticle.service';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly createArticleService: CreateArticleService,
    private readonly getArticleService: GetArticleService
  ) {}

  @Post('create')
  async create(@Body() data: CreateArticleDTO) {
    return this.createArticleService.execute(data);
  }

  @Get('allArticles')
  async getAll() {
    return this.getArticleService.getAll();
  }

  @Get('allAuthors')
  async getAllAuthors() {
    return this.getArticleService.getAllAuthors();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getArticleService.getById(id);
  }

  @Get('authorsBy/:articleId')
  async getAuthorByArticleId(@Param('articleId') articleId: string) {
    return this.getArticleService.getByAuthorId(articleId);
  }
}
