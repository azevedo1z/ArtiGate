import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticleDTO {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  summary: string;

  @ApiProperty({ required: false })
  authorIds: string[];

  constructor(id: string, summary: string, authorIds: string[]) {
    this.id = id;
    this.summary = summary;
    this.authorIds = authorIds;
  }
}
