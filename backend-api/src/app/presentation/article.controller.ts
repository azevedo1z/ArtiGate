import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateArticleService } from '../application/services/article/createArticle.service';
import { CreateArticleDTO } from '../application/dtos/article/createArticle.dto';
import { GetArticleService } from '../application/services/article/getArticle.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from '../infrastructure/authGuard.service';

@Controller('article')
@ApiBearerAuth()
@UseGuards(AuthGuardService)
export class ArticleController {
  constructor(
    private readonly createArticleService: CreateArticleService,
    private readonly getArticleService: GetArticleService
  ) {}

  @Post('create')
  async create(@Body() data: CreateArticleDTO) {
    return await this.createArticleService.execute(data);
  }

  @Get('allArticles')
  async getAll() {
    return await this.getArticleService.getAll();
  }

  @Get('allAuthors')
  async getAllAuthors() {
    return await this.getArticleService.getAllAuthors();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.getArticleService.getById(id);
  }

  @Get('authorsBy/:articleId')
  async getAuthorByArticleId(@Param('articleId') articleId: string) {
    return await this.getArticleService.getByAuthorId(articleId);
  }
}
