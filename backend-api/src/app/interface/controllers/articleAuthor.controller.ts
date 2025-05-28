import {
  BadRequestException,
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from '../../infrastructure/services/authGuard.service';
import { GetArticleAuthorService } from '../../application/services/article/getArticleAuthor.service';

@Controller('articleAuthor')
@ApiBearerAuth()
@UseGuards(AuthGuardService)
export class ArticleAuthorController {
  constructor(
    private readonly getArticleAuthorService: GetArticleAuthorService
  ) {}

  @Get('allArticleAuthors')
  async getAll() {
    try {
      return await this.getArticleAuthorService.getAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
