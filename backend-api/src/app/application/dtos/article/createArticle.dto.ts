import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDTO {
  @ApiProperty()
  summary: string;

  @ApiProperty()
  authorIds: string[];

  constructor(summary: string, authorIds: string[]) {
    this.summary = summary;
    this.authorIds = authorIds;
  }
}
