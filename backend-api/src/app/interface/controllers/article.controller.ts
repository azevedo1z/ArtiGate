import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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
  async create(@Body() data: CreateArticleDTO) {
    try {
      return await this.createArticleService.execute(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Put('update')
  async update(@Body() data: UpdateArticleDTO) {
    try {
      return await this.updateArticleService.execute(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  async delete(@Param() id: string) {
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

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      return await this.getArticleService.getById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('articlesBy/{authorId}')
  async getByAuthorId(@Param('authorId') authorId: string) {
    try {
      return await this.getArticleService.getByAuthorId(authorId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
