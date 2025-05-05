import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDTO {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  articleId: string;

  @ApiProperty({ required: false })
  reviewerId: string;

  @ApiProperty({ required: false })
  score: number;

  @ApiProperty({ required: false })
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
