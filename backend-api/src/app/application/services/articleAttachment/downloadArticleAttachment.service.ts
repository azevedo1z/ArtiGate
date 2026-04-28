import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import {
  ArticleAttachmentDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
  UserRoleDatabaseAdapter,
  RoleDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
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
    private readonly attachmentAdapter: ArticleAttachmentDatabaseAdapter,
    private readonly articleAuthorAdapter: ArticleAuthorDatabaseAdapter,
    private readonly userRoleAdapter: UserRoleDatabaseAdapter,
    private readonly roleAdapter: RoleDatabaseAdapter,
    private readonly storage: PdfStorageService
  ) {}

  async execute(
    articleId: string,
    requesterId: string
  ): Promise<AttachmentDownload> {
    await this.ensureAccessRights(articleId, requesterId);

    const attachments = await this.attachmentAdapter.findMany(articleId);
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
    const authors = await this.articleAuthorAdapter.findMany(articleId);
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
    const userRoles = await this.userRoleAdapter.findManyByUserId?.(
      requesterId
    );
    if (!userRoles?.length) return false;

    const reviewerRole = await this.roleAdapter.findByName?.(ROLES.REVIEWER);

    if (!reviewerRole) return false;

    return userRoles.some((ur) => ur.roleId === reviewerRole.id);
  }
}
