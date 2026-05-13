import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateArticleDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(5000)
  summary?: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  authorIds?: string[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  scoreAvg?: number;

  constructor(
    id: string,
    summary?: string,
    authorIds?: string[],
    scoreAvg?: number
  ) {
    this.id = id;
    this.summary = summary;
    this.authorIds = authorIds;
    this.scoreAvg = scoreAvg;
  }
}
