import { Readable } from 'stream';
import { DownloadArticleAttachmentService } from './downloadArticleAttachment.service';
import {
  ArticleAttachmentDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
  RoleDatabaseAdapter,
  UserRoleDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { PdfStorageService } from '../../../infrastructure/services/pdfStorage.service';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';

describe('DownloadArticleAttachmentService', () => {
  let service: DownloadArticleAttachmentService;
  let attachmentAdapter: jest.Mocked<ArticleAttachmentDatabaseAdapter>;
  let articleAuthorAdapter: jest.Mocked<ArticleAuthorDatabaseAdapter>;
  let userRoleAdapter: jest.Mocked<UserRoleDatabaseAdapter>;
  let roleAdapter: jest.Mocked<RoleDatabaseAdapter>;
  let storage: jest.Mocked<PdfStorageService>;

  beforeEach(() => {
    attachmentAdapter = {
      findMany: jest.fn(),
    } as never;
    articleAuthorAdapter = {
      findMany: jest.fn(),
    } as never;
    userRoleAdapter = {
      findManyByUserId: jest.fn(),
    } as never;
    roleAdapter = {
      findByName: jest.fn(),
    } as never;
    storage = {
      ensureExists: jest.fn().mockResolvedValue(undefined),
      openReadStream: jest.fn().mockReturnValue(Readable.from(['content'])),
    } as never;

    service = new DownloadArticleAttachmentService(
      attachmentAdapter,
      articleAuthorAdapter,
      userRoleAdapter,
      roleAdapter,
      storage
    );
  });

  it('returns the stream when requester is an author', async () => {
    articleAuthorAdapter.findMany.mockResolvedValue([
      { userId: 'user-1' } as never,
    ]);
    attachmentAdapter.findMany.mockResolvedValue([
      {
        id: 'att-1',
        storedName: 'stored.pdf',
        originalName: 'paper.pdf',
        mimeType: 'application/pdf',
        size: 7,
        checksum: 'sha',
      } as never,
    ]);

    const result = await service.execute('article-1', 'user-1');

    expect(result.originalName).toBe('paper.pdf');
    expect(storage.ensureExists).toHaveBeenCalledWith('stored.pdf');
  });

  it('returns the stream when requester is a reviewer', async () => {
    articleAuthorAdapter.findMany.mockResolvedValue([
      { userId: 'someone-else' } as never,
    ]);
    (
      userRoleAdapter.findManyByUserId as unknown as jest.Mock
    ).mockResolvedValue([{ roleId: 'reviewer-role' } as never]);
    (roleAdapter.findByName as unknown as jest.Mock).mockResolvedValue({
      id: 'reviewer-role',
    } as never);
    attachmentAdapter.findMany.mockResolvedValue([
      {
        id: 'att-1',
        storedName: 'stored.pdf',
        originalName: 'paper.pdf',
        mimeType: 'application/pdf',
        size: 7,
        checksum: 'sha',
      } as never,
    ]);

    const result = await service.execute('article-1', 'reviewer-1');

    expect(result.originalName).toBe('paper.pdf');
  });

  it('throws UnauthorizedException when not author or reviewer', async () => {
    articleAuthorAdapter.findMany.mockResolvedValue([
      { userId: 'someone-else' } as never,
    ]);
    (
      userRoleAdapter.findManyByUserId as unknown as jest.Mock
    ).mockResolvedValue([]);

    await expect(service.execute('article-1', 'user-1')).rejects.toThrow(
      UnauthorizedException
    );
  });

  it('throws NotFoundException when the attachment does not exist', async () => {
    articleAuthorAdapter.findMany.mockResolvedValue([
      { userId: 'user-1' } as never,
    ]);
    attachmentAdapter.findMany.mockResolvedValue([]);

    await expect(service.execute('article-1', 'user-1')).rejects.toThrow(
      NotFoundException
    );
  });
});
