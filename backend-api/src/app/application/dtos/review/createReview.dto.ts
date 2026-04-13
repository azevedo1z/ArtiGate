import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewDTO {
  @ApiProperty()
  @IsString()
  articleId: string;

  @ApiProperty()
  @IsString()
  reviewerId: string;

  @ApiProperty({ minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  score: number;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
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
