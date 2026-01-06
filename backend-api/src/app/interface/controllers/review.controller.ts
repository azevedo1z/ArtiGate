import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateReviewService } from '../../application/services/review/createReview.service';
import { CreateReviewDTO } from '../../application/dtos/review/createReview.dto';
import { GetReviewService } from '../../application/services/review/getReview.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from '../../infrastructure/services/authGuard.service';
import { UpdateReviewDTO } from '../../application/dtos/review/updateReview.dto';
import { UpdateReviewService } from '../../application/services/review/updateReview.service';
import { DeleteReviewService } from '../../application/services/review/deleteReview.service';

@Controller('review')
@ApiBearerAuth()
@UseGuards(AuthGuardService)
export class ReviewController {
  constructor(
    private readonly createReviewService: CreateReviewService,
    private readonly getReviewService: GetReviewService,
    private readonly updateReviewService: UpdateReviewService,
    private readonly deleteReviewService: DeleteReviewService
  ) {}

  @Post('create')
  async create(@Body() data: CreateReviewDTO) {
    return await this.createReviewService.execute(data);
  }

  @Put('update')
  async update(@Body() data: UpdateReviewDTO) {
    return await this.updateReviewService.execute(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deleteReviewService.execute(id);
  }

  @Get('all')
  async getAll() {
    return await this.getReviewService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.getReviewService.getById(id);
  }

  @Get(':userId')
  async getByUserId(@Param('userId') userId: string) {
    return await this.getReviewService.getByReviewerId(userId);
  }

  @Get(':articleId')
  async getByArticleId(@Param('articleId') articleId: string) {
    return await this.getReviewService.getByArticleId(articleId);
  }
}
