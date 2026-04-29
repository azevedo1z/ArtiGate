import { ArticleAttachment } from '@prisma/client';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { ArticleAttachmentDatabaseAdapter } from '../../interface/adapter/database.adapter';
import { ValidationException } from '../../shared/exceptions/app.exception';
import {
  PaginationDTO,
  normalizePagination,
} from '../../shared/dtos/pagination.dto';

@Injectable()
export class ArticleAttachmentRepository
  implements ArticleAttachmentDatabaseAdapter
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<ArticleAttachment>): Promise<ArticleAttachment> {
    if (
      !data.articleId ||
      !data.storedName ||
      !data.originalName ||
      !data.mimeType ||
      data.size == null ||
      !data.checksum ||
      !data.uploaderId
    )
      throw new ValidationException(
        'Missing required fields to create an ArticleAttachment.'
      );

    return await this.prisma.articleAttachment.create({
      data: {
        articleId: data.articleId,
        storedName: data.storedName,
        originalName: data.originalName,
        mimeType: data.mimeType,
        size: data.size,
        checksum: data.checksum,
        uploaderId: data.uploaderId,
      },
    });
  }

  async update(_data: Partial<ArticleAttachment>): Promise<ArticleAttachment> {
    throw new NotImplementedException();
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.articleAttachment.update({
      where: { id },
      data: { deletedOn: new Date() },
    });
    return true;
  }

  async findById(id: string): Promise<ArticleAttachment | null> {
    return await this.prisma.articleAttachment.findFirst({
      where: { id, deletedOn: null },
    });
  }

  async findAll(pagination?: PaginationDTO): Promise<ArticleAttachment[]> {
    const { skip, take } = normalizePagination(pagination);
    return await this.prisma.articleAttachment.findMany({
      where: { deletedOn: null },
      skip,
      take,
      orderBy: { createdOn: 'desc' },
    });
  }

  async countAll(): Promise<number> {
    return await this.prisma.articleAttachment.count({
      where: { deletedOn: null },
    });
  }

  async findMany(articleId: string): Promise<ArticleAttachment[]> {
    return await this.prisma.articleAttachment.findMany({
      where: { articleId, deletedOn: null },
      orderBy: { createdOn: 'desc' },
    });
  }
}
