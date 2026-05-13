import { Readable } from 'stream';
import { DownloadArticleAttachmentService } from './downloadArticleAttachment.service';
import { ArticleAttachmentRepository } from '../../../interface/repositories/articleAttachment.repository.port';
import { ArticleAuthorRepository } from '../../../interface/repositories/articleAuthor.repository.port';
import { UserRoleRepository } from '../../../interface/repositories/userRole.repository.port';
import { RoleRepository } from '../../../interface/repositories/role.repository.port';
import { PdfStorageService } from '../../../infrastructure/services/pdfStorage.service';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';

describe('DownloadArticleAttachmentService', () => {
  let service: DownloadArticleAttachmentService;
  let attachmentRepo: jest.Mocked<ArticleAttachmentRepository>;
  let articleAuthorRepo: jest.Mocked<ArticleAuthorRepository>;
  let userRoleRepo: jest.Mocked<UserRoleRepository>;
  let roleRepo: jest.Mocked<RoleRepository>;
  let storage: jest.Mocked<PdfStorageService>;

  beforeEach(() => {
    attachmentRepo = {
      findMany: jest.fn(),
    } as never;
    articleAuthorRepo = {
      findMany: jest.fn(),
    } as never;
    userRoleRepo = {
      findManyByUserId: jest.fn(),
    } as never;
    roleRepo = {
      findByName: jest.fn(),
    } as never;
    storage = {
      ensureExists: jest.fn().mockResolvedValue(undefined),
      openReadStream: jest.fn().mockReturnValue(Readable.from(['content'])),
    } as never;

    service = new DownloadArticleAttachmentService(
      attachmentRepo,
      articleAuthorRepo,
      userRoleRepo,
      roleRepo,
      storage
    );
  });

  it('returns the stream when requester is an author', async () => {
    articleAuthorRepo.findMany.mockResolvedValue([
      { userId: 'user-1' } as never,
    ]);
    attachmentRepo.findMany.mockResolvedValue([
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
    articleAuthorRepo.findMany.mockResolvedValue([
      { userId: 'someone-else' } as never,
    ]);
    (
      userRoleRepo.findManyByUserId as unknown as jest.Mock
    ).mockResolvedValue([{ roleId: 'reviewer-role' } as never]);
    (roleRepo.findByName as unknown as jest.Mock).mockResolvedValue({
      id: 'reviewer-role',
    } as never);
    attachmentRepo.findMany.mockResolvedValue([
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
    articleAuthorRepo.findMany.mockResolvedValue([
      { userId: 'someone-else' } as never,
    ]);
    (
      userRoleRepo.findManyByUserId as unknown as jest.Mock
    ).mockResolvedValue([]);

    await expect(service.execute('article-1', 'user-1')).rejects.toThrow(
      UnauthorizedException
    );
  });

  it('throws NotFoundException when the attachment does not exist', async () => {
    articleAuthorRepo.findMany.mockResolvedValue([
      { userId: 'user-1' } as never,
    ]);
    attachmentRepo.findMany.mockResolvedValue([]);

    await expect(service.execute('article-1', 'user-1')).rejects.toThrow(
      NotFoundException
    );
  });
});
