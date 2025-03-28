import { Body, Controller, Post } from '@nestjs/common';
import { CreateReviewService } from '../application/services/review/createReview.service';
import { CreateReviewDTO } from '../application/dtos/review/createReview.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly createReviewService: CreateReviewService) {}

  @Post('create')
  async create(@Body() data: CreateReviewDTO) {
    return this.createReviewService.execute(data);
  }
}
