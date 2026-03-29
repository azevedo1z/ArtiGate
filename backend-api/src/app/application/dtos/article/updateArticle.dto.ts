import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';

export class UpdateArticleDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
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
