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
import { CreateReviewService } from '../application/services/review/createReview.service';
import { CreateReviewDTO } from '../application/dtos/review/createReview.dto';
import { GetReviewService } from '../application/services/review/getReview.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from '../infrastructure/authGuard.service';
import { UpdateReviewDTO } from '../application/dtos/review/updateReview.dto';
import { UpdateReviewService } from '../application/services/review/updateReview.service';
import { DeleteReviewService } from '../application/services/review/deleteReview.service';

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
    try {
      return await this.createReviewService.execute(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Put('update')
  async update(@Body() data: UpdateReviewDTO) {
    try {
      return await this.updateReviewService.execute(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete('delete')
  async delete(@Body() id: string) {
    try {
      return await this.deleteReviewService.execute(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      return await this.getReviewService.getBydId(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('allReviews')
  async getAll() {
    try {
      return await this.getReviewService.getAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
