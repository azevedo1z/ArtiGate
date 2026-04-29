/// <reference types="multer" />
import { UploadArticleAttachmentService } from './uploadArticleAttachment.service';
import {
  ArticleAttachmentDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
  ArticleDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { PdfSecurityValidatorService } from '../../../infrastructure/services/pdfSecurityValidator.service';
import { PdfStorageService } from '../../../infrastructure/services/pdfStorage.service';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';

describe('UploadArticleAttachmentService', () => {
  let service: UploadArticleAttachmentService;
  let attachmentAdapter: jest.Mocked<ArticleAttachmentDatabaseAdapter>;
  let articleAdapter: jest.Mocked<ArticleDatabaseAdapter>;
  let articleAuthorAdapter: jest.Mocked<ArticleAuthorDatabaseAdapter>;
  let storage: jest.Mocked<PdfStorageService>;
  let validator: jest.Mocked<PdfSecurityValidatorService>;

  const file = { originalname: 'paper.pdf' } as Express.Multer.File;

  beforeEach(() => {
    attachmentAdapter = {
      create: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    } as never;
    articleAdapter = { findById: jest.fn() } as never;
    articleAuthorAdapter = { findMany: jest.fn() } as never;
    storage = {
      generateStoredName: jest.fn().mockReturnValue('stored-uuid.pdf'),
      write: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    } as never;
    validator = {
      validate: jest.fn().mockReturnValue({
        buffer: Buffer.from('content'),
        size: 7,
        checksum: 'a'.repeat(64),
        sanitizedName: 'paper.pdf',
      }),
    } as never;

    service = new UploadArticleAttachmentService(
      attachmentAdapter,
      articleAdapter,
      articleAuthorAdapter,
      storage,
      validator
    );
  });

  it('throws NotFoundException when the article does not exist', async () => {
    articleAdapter.findById.mockResolvedValue(null);

    await expect(
      service.execute('article-1', 'user-1', file)
    ).rejects.toThrow(NotFoundException);

    expect(storage.write).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedException when the requester is not an author', async () => {
    articleAdapter.findById.mockResolvedValue({ id: 'article-1' } as never);
    articleAuthorAdapter.findMany.mockResolvedValue([
      { userId: 'someone-else' } as never,
    ]);

    await expect(
      service.execute('article-1', 'user-1', file)
    ).rejects.toThrow(UnauthorizedException);

    expect(storage.write).not.toHaveBeenCalled();
  });

  it('throws ConflictException when an attachment already exists for the article', async () => {
    articleAdapter.findById.mockResolvedValue({ id: 'article-1' } as never);
    articleAuthorAdapter.findMany.mockResolvedValue([
      { userId: 'user-1' } as never,
    ]);
    attachmentAdapter.findMany.mockResolvedValue([
      { id: 'existing' } as never,
    ]);

    await expect(
      service.execute('article-1', 'user-1', file)
    ).rejects.toThrow(ConflictException);

    expect(storage.write).not.toHaveBeenCalled();
  });

  it('writes the file and persists the metadata when the requester is an author', async () => {
    articleAdapter.findById.mockResolvedValue({ id: 'article-1' } as never);
    articleAuthorAdapter.findMany.mockResolvedValue([
      { userId: 'user-1' } as never,
    ]);
    attachmentAdapter.create.mockResolvedValue({
      id: 'att-1',
      articleId: 'article-1',
      storedName: 'stored-uuid.pdf',
      originalName: 'paper.pdf',
      mimeType: 'application/pdf',
      size: 7,
      checksum: 'a'.repeat(64),
      uploaderId: 'user-1',
    } as never);

    const result = await service.execute('article-1', 'user-1', file);

    expect(validator.execute).toHaveBeenCalledWith(file);
    expect(storage.write).toHaveBeenCalledWith(
      'stored-uuid.pdf',
      expect.any(Buffer)
    );
    expect(attachmentAdapter.create).toHaveBeenCalledWith(
      expect.objectContaining({
        articleId: 'article-1',
        storedName: 'stored-uuid.pdf',
        originalName: 'paper.pdf',
        mimeType: 'application/pdf',
        uploaderId: 'user-1',
      })
    );
    expect(result.id).toBe('att-1');
  });

  it('rolls back the file write when database insert fails', async () => {
    articleAdapter.findById.mockResolvedValue({ id: 'article-1' } as never);
    articleAuthorAdapter.findMany.mockResolvedValue([
      { userId: 'user-1' } as never,
    ]);
    attachmentAdapter.create.mockRejectedValue(new Error('db down'));

    await expect(
      service.execute('article-1', 'user-1', file)
    ).rejects.toThrow('db down');

    expect(storage.delete).toHaveBeenCalledWith('stored-uuid.pdf');
  });
});
