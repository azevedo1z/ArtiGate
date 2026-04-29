/// <reference types="multer" />
import { SubmitArticleService } from './submitArticle.service';
import { CreateArticleService } from './createArticle.service';
import { UploadArticleAttachmentService } from '../articleAttachment/uploadArticleAttachment.service';
import { PdfSecurityValidatorService } from '../../../infrastructure/services/pdfSecurityValidator.service';
import { ArticleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { ValidationException } from '../../../shared/exceptions/app.exception';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';

describe('SubmitArticleService', () => {
  let service: SubmitArticleService;
  let validator: jest.Mocked<PdfSecurityValidatorService>;
  let createArticleService: jest.Mocked<CreateArticleService>;
  let uploadAttachmentService: jest.Mocked<UploadArticleAttachmentService>;
  let articleAdapter: jest.Mocked<ArticleDatabaseAdapter>;

  const file = { originalname: 'paper.pdf' } as Express.Multer.File;
  const dto: CreateArticleDTO = {
    summary: 'A long enough summary',
    authorIds: ['user-1'],
  };

  beforeEach(() => {
    validator = { validate: jest.fn() } as never;
    createArticleService = { execute: jest.fn() } as never;
    uploadAttachmentService = { execute: jest.fn() } as never;
    articleAdapter = { delete: jest.fn() } as never;

    service = new SubmitArticleService(
      validator,
      createArticleService,
      uploadAttachmentService,
      articleAdapter
    );
  });

  it('throws ValidationException when the requester is not in authorIds', async () => {
    await expect(
      service.execute(dto, 'someone-else', file)
    ).rejects.toThrow(ValidationException);

    expect(createArticleService.execute).not.toHaveBeenCalled();
  });

  it('throws ValidationException when no PDF is provided', async () => {
    await expect(
      service.execute(dto, 'user-1', undefined as never)
    ).rejects.toThrow(ValidationException);

    expect(validator.execute).not.toHaveBeenCalled();
  });

  it('validates the PDF before creating the article', async () => {
    validator.execute.mockImplementation(() => {
      throw new ValidationException('bad pdf');
    });

    await expect(service.execute(dto, 'user-1', file)).rejects.toThrow(
      ValidationException
    );

    expect(createArticleService.execute).not.toHaveBeenCalled();
  });

  it('creates the article and uploads the attachment on success', async () => {
    createArticleService.execute.mockResolvedValue({
      id: 'article-1',
      summary: 'A long enough summary',
      scoreAvg: 0,
    } as never);
    uploadAttachmentService.execute.mockResolvedValue({
      id: 'att-1',
    } as never);

    const result = await service.execute(dto, 'user-1', file);

    expect(validator.execute).toHaveBeenCalledWith(file);
    expect(createArticleService.execute).toHaveBeenCalledWith(dto);
    expect(uploadAttachmentService.execute).toHaveBeenCalledWith(
      'article-1',
      'user-1',
      file
    );
    expect(result.article.id).toBe('article-1');
    expect(result.attachment.id).toBe('att-1');
  });

  it('rolls back the article when attachment upload fails', async () => {
    createArticleService.execute.mockResolvedValue({
      id: 'article-1',
    } as never);
    uploadAttachmentService.execute.mockRejectedValue(new Error('storage down'));
    articleAdapter.delete.mockResolvedValue(true);

    await expect(service.execute(dto, 'user-1', file)).rejects.toThrow(
      'storage down'
    );

    expect(articleAdapter.delete).toHaveBeenCalledWith('article-1');
  });

  it('still throws the original error if rollback also fails', async () => {
    createArticleService.execute.mockResolvedValue({
      id: 'article-1',
    } as never);
    uploadAttachmentService.execute.mockRejectedValue(new Error('storage down'));
    articleAdapter.delete.mockRejectedValue(new Error('cleanup failed'));

    await expect(service.execute(dto, 'user-1', file)).rejects.toThrow(
      'storage down'
    );
  });
});
