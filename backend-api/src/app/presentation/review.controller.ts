import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateReviewService } from '../application/services/review/createReview.service';
import { CreateReviewDTO } from '../application/dtos/review/createReview.dto';
import { GetReviewService } from '../application/services/review/getReview.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly createReviewService: CreateReviewService,
    private readonly getReviewService: GetReviewService
  ) {}

  @Post('create')
  async create(@Body() data: CreateReviewDTO) {
    return this.createReviewService.execute(data);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getReviewService.getBydId(id);
  }

  @Get('allReviews')
  async getAll() {
    return this.getReviewService.getAll();
  }
}
