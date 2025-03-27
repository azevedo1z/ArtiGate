import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateArticleService } from '../applications/services/article/createArticle.service';
import { CreateArticleDTO } from '../applications/dtos/article/createArticle.dto';
import { GetArticleService } from '../applications/services/article/getArticle.service';

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
}
