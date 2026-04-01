import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateReviewDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  articleId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reviewerId: string;

  @ApiProperty({ minimum: 1, maximum: 10, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  score: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  commentary: string;

  constructor(
    id: string,
    articleId: string,
    reviewerId: string,
    score: number,
    commentary: string
  ) {
    this.id = id;
    this.articleId = articleId;
    this.reviewerId = reviewerId;
    this.score = score;
    this.commentary = commentary;
  }
}
