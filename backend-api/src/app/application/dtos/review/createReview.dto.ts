import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUUID,
  Min,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewDTO {
  @ApiProperty()
  @IsUUID('4')
  articleId: string;

  @ApiProperty({ minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  score: number;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  @Transform(({ value }) => value?.trim())
  commentary: string;

  constructor(articleId: string, score: number, commentary: string) {
    this.articleId = articleId;
    this.score = score;
    this.commentary = commentary;
  }
}
