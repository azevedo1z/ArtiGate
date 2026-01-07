import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateReviewDTO {
  @ApiProperty()
  @IsString()
  articleId: string;

  @ApiProperty()
  @IsString()
  reviewerId: string;

  @ApiProperty()
  @IsNumber()
  score: number;

  @ApiProperty()
  @IsString()
  commentary: string;

  constructor(
    articleId: string,
    reviewerId: string,
    score: number,
    commentary: string
  ) {
    this.articleId = articleId;
    this.reviewerId = reviewerId;
    this.score = score;
    this.commentary = commentary;
  }
}
