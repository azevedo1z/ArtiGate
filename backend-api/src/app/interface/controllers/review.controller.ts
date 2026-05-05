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
import { CreateReviewService } from '../../application/services/review/createReview.service';
import { CreateReviewDTO } from '../../application/dtos/review/createReview.dto';
import { GetReviewService } from '../../application/services/review/getReview.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from '../../infrastructure/services/authGuard.service';
import { AccessFeePaymentGuard } from '../../infrastructure/services/accessFeePayment.guard';
import { UpdateReviewDTO } from '../../application/dtos/review/updateReview.dto';
import { UpdateReviewService } from '../../application/services/review/updateReview.service';
import { DeleteReviewService } from '../../application/services/review/deleteReview.service';

@Controller('review')
@ApiBearerAuth()
@UseGuards(AuthGuardService, AccessFeePaymentGuard)
export class ReviewController {
  constructor(
    private readonly createReviewService: CreateReviewService,
    private readonly getReviewService: GetReviewService,
    private readonly updateReviewService: UpdateReviewService,
    private readonly deleteReviewService: DeleteReviewService
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateReviewDTO) {
    return await this.createReviewService.execute(data);
  }

  @Put('update')
  async update(@Body() data: UpdateReviewDTO) {
    return await this.updateReviewService.execute(data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deleteReviewService.execute(id);
  }

  @Get('all')
  async getAll(@Query() pagination: PaginationDTO) {
    return await this.getReviewService.getAll(pagination);
  }

  @Get('reviewer/:userId')
  async getByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.getReviewService.getByReviewerId(userId);
  }

  @Get('article/:articleId')
  async getByArticleId(@Param('articleId', ParseUUIDPipe) articleId: string) {
    return await this.getReviewService.getByArticleId(articleId);
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.getReviewService.getById(id);
  }
}
