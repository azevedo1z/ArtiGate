import { Body, Controller, Post } from '@nestjs/common';
import { CreateArticleService } from '../applications/services/article/createArticle.service';
import { CreateArticleDTO } from '../applications/dtos/article/createArticle.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly createArticleService: CreateArticleService) {}

  @Post('create')
  async create(@Body() data: CreateArticleDTO) {
    return this.createArticleService.execute(data);
  }
}
