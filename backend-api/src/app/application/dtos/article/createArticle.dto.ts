import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateArticleDTO {
  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  @Transform(({ value }) => value?.trim())
  summary: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  authorIds: string[];

  constructor(summary: string, authorIds: string[]) {
    this.summary = summary;
    this.authorIds = authorIds;
  }
}
