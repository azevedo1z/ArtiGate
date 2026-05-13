import { ArticleAttachment as ArticleAttachmentRow } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ArticleAttachment } from '../../domain/models/articleAttachment.model';
import { PrismaService } from '../services/prisma.service';
import {
  ArticleAttachmentRepository,
  CreateArticleAttachmentInput,
} from '../../interface/repositories/articleAttachment.repository.port';

const rowToDomain = (row: ArticleAttachmentRow): ArticleAttachment =>
  ArticleAttachment.factory({
    id: row.id,
    articleId: row.articleId,
    storedName: row.storedName,
    originalName: row.originalName,
    mimeType: row.mimeType,
    size: row.size,
    checksum: row.checksum,
    uploaderId: row.uploaderId,
  });

@Injectable()
export class PrismaArticleAttachmentRepository
  implements ArticleAttachmentRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArticleAttachmentInput): Promise<ArticleAttachment> {
    const row = await this.prisma.articleAttachment.create({ data });
    return rowToDomain(row);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.articleAttachment.update({
      where: { id },
      data: { deletedOn: new Date() },
    });
    return true;
  }

  async findById(id: string): Promise<ArticleAttachment | null> {
    const row = await this.prisma.articleAttachment.findFirst({
      where: { id },
    });
    return row ? rowToDomain(row) : null;
  }

  async findMany(articleId: string): Promise<ArticleAttachment[]> {
    const rows = await this.prisma.articleAttachment.findMany({
      where: { articleId },
      orderBy: { createdOn: 'desc' },
    });
    return rows.map(rowToDomain);
  }
}
