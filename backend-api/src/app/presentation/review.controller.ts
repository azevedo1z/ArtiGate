import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateReviewService } from '../application/services/review/createReview.service';
import { CreateReviewDTO } from '../application/dtos/review/createReview.dto';
import { GetReviewService } from '../application/services/review/getReview.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly createReviewService: CreateReviewService,
    private readonly getReviewService: GetReviewService
  ) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards()
  async create(@Body() data: CreateReviewDTO) {
    return this.createReviewService.execute(data);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards()
  async getById(@Param('id') id: string) {
    return this.getReviewService.getBydId(id);
  }

  @Get('allReviews')
  @ApiBearerAuth()
  @UseGuards()
  async getAll() {
    return this.getReviewService.getAll();
  }
}
