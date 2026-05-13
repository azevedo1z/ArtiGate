import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { ArticleAttachmentRepository } from '../../../interface/repositories/articleAttachment.repository.port';
import { ArticleAuthorRepository } from '../../../interface/repositories/articleAuthor.repository.port';
import { UserRoleRepository } from '../../../interface/repositories/userRole.repository.port';
import { RoleRepository } from '../../../interface/repositories/role.repository.port';
import { PdfStorageService } from '../../../infrastructure/services/pdfStorage.service';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';
import { ROLES } from '../../../shared/constants';

export interface AttachmentDownload {
  stream: Readable;
  originalName: string;
  mimeType: string;
  size: number;
  checksum: string;
}

@Injectable()
export class DownloadArticleAttachmentService {
  constructor(
    private readonly attachmentRepo: ArticleAttachmentRepository,
    private readonly articleAuthorRepo: ArticleAuthorRepository,
    private readonly userRoleRepo: UserRoleRepository,
    private readonly roleRepo: RoleRepository,
    private readonly storage: PdfStorageService
  ) {}

  async execute(
    articleId: string,
    requesterId: string
  ): Promise<AttachmentDownload> {
    await this.ensureAccessRights(articleId, requesterId);

    const attachments = await this.attachmentRepo.findMany(articleId);
    if (!attachments.length)
      throw new NotFoundException(
        'No attachment is registered for this article.'
      );

    const attachment = attachments[0];

    await this.storage.ensureExists(attachment.storedName);

    return {
      stream: this.storage.openReadStream(attachment.storedName),
      originalName: attachment.originalName,
      mimeType: attachment.mimeType,
      size: attachment.size,
      checksum: attachment.checksum,
    };
  }

  private async ensureAccessRights(
    articleId: string,
    requesterId: string
  ): Promise<void> {
    const authors = await this.articleAuthorRepo.findMany(articleId);
    if (authors.some((a) => a.userId === requesterId)) return;

    const isReviewer = await this.requesterHasReviewerRole(requesterId);
    if (isReviewer) return;

    throw new UnauthorizedException(
      'You do not have permission to download this attachment.'
    );
  }

  private async requesterHasReviewerRole(
    requesterId: string
  ): Promise<boolean> {
    const userRoles = await this.userRoleRepo.findManyByUserId(requesterId);
    if (!userRoles.length) return false;

    const reviewerRole = await this.roleRepo.findByName(ROLES.REVIEWER);

    if (!reviewerRole) return false;

    return userRoles.some((ur) => ur.roleId === reviewerRole.id);
  }
}
