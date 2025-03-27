import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDTO {
  @ApiProperty()
  articleId: string;

  @ApiProperty()
  reviewerId: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
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
