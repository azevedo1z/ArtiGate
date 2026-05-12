import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateReviewDTO {
  @ApiProperty()
  @IsUUID('4')
  id: string;

  @ApiProperty({ minimum: 1, maximum: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  score?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  @Transform(({ value }) => value?.trim())
  commentary?: string;

  constructor(id: string, score?: number, commentary?: string) {
    this.id = id;
    this.score = score;
    this.commentary = commentary;
  }
}
