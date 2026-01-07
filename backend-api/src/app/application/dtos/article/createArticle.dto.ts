import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class CreateArticleDTO {
  @ApiProperty()
  @IsString()
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
