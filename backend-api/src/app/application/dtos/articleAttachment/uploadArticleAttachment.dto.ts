import { ApiProperty } from '@nestjs/swagger';

export class UploadArticleAttachmentDTO {
  @ApiProperty()
  articleId: string;

  @ApiProperty()
  uploaderId: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  constructor(
    articleId: string,
    uploaderId: string,
    file: Express.Multer.File
  ) {
    this.articleId = articleId;
    this.uploaderId = uploaderId;
    this.file = file;
  }
}

export class ArticleAttachmentMetadataDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  articleId: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  checksum: string;

  constructor(
    id: string,
    articleId: string,
    originalName: string,
    mimeType: string,
    size: number,
    checksum: string
  ) {
    this.id = id;
    this.articleId = articleId;
    this.originalName = originalName;
    this.mimeType = mimeType;
    this.size = size;
    this.checksum = checksum;
  }
}
