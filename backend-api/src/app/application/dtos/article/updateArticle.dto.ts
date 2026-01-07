import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateArticleDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  summary: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  authorIds: string[];

  constructor(id: string, summary: string, authorIds: string[]) {
    this.id = id;
    this.summary = summary;
    this.authorIds = authorIds;
  }
}
