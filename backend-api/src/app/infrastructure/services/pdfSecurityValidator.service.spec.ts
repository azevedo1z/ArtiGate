/// <reference types="multer" />
import { ConfigService } from '@nestjs/config';
import { PdfSecurityValidatorService } from './pdfSecurityValidator.service';
import { ValidationException } from '../../shared/exceptions/app.exception';

const PDF_HEADER = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
const PDF_FOOTER = Buffer.from('\n%%EOF\n');

const buildPdfBuffer = (body = Buffer.alloc(64, 0x20)): Buffer =>
  Buffer.concat([PDF_HEADER, body, PDF_FOOTER]);

const buildFile = (overrides: Partial<Express.Multer.File> = {}): Express.Multer.File => {
  const buffer = overrides.buffer ?? buildPdfBuffer();
  return {
    fieldname: 'pdf',
    originalname: 'paper.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    size: buffer.length,
    buffer,
    destination: '',
    filename: '',
    path: '',
    stream: undefined as never,
    ...overrides,
  } as Express.Multer.File;
};

const buildService = (maxBytes = 1024 * 1024): PdfSecurityValidatorService => {
  const config = { getOrThrow: jest.fn().mockReturnValue(maxBytes) };
  return new PdfSecurityValidatorService(config as unknown as ConfigService);
};

describe('PdfSecurityValidatorService', () => {
  let service: PdfSecurityValidatorService;

  beforeEach(() => {
    service = buildService();
  });

  it('returns the buffer, size, checksum and sanitized name on a valid PDF', () => {
    const file = buildFile({ originalname: 'My Paper Final.pdf' });

    const result = service.execute(file);

    expect(result.size).toBe(file.buffer.length);
    expect(result.checksum).toMatch(/^[0-9a-f]{64}$/);
    expect(result.sanitizedName).toBe('My_Paper_Final.pdf');
    expect(result.buffer).toBe(file.buffer);
  });

  it('rejects when no file is provided', () => {
    expect(() =>
      service.execute(undefined as unknown as Express.Multer.File)
    ).toThrow(ValidationException);
  });

  it('rejects an empty buffer', () => {
    const file = buildFile({ buffer: Buffer.alloc(0), size: 0 });

    expect(() => service.execute(file)).toThrow(ValidationException);
  });

  it('rejects when reported size differs from buffer length', () => {
    const buffer = buildPdfBuffer();
    const file = buildFile({ buffer, size: buffer.length + 10 });

    expect(() => service.execute(file)).toThrow(ValidationException);
  });

  it('rejects files larger than the configured max bytes', () => {
    const tinyService = buildService(1024);
    const buffer = buildPdfBuffer(Buffer.alloc(2048, 0x41));
    const file = buildFile({ buffer, size: buffer.length });

    expect(() => tinyService.execute(file)).toThrow(ValidationException);
  });

  it('rejects non-pdf MIME types even if the magic bytes match', () => {
    const file = buildFile({ mimetype: 'application/octet-stream' });

    expect(() => service.execute(file)).toThrow(ValidationException);
  });

  it('rejects content with bogus magic bytes', () => {
    const fakeContent = Buffer.concat([
      Buffer.from('NOTPDF'),
      Buffer.alloc(50, 0x41),
      Buffer.from('%%EOF'),
    ]);
    const file = buildFile({ buffer: fakeContent, size: fakeContent.length });

    expect(() => service.execute(file)).toThrow(ValidationException);
  });

  it('rejects content missing a PDF trailer at the tail', () => {
    const buffer = Buffer.concat([PDF_HEADER, Buffer.alloc(50, 0x20)]);
    const file = buildFile({ buffer, size: buffer.length });

    expect(() => service.execute(file)).toThrow(ValidationException);
  });

  it('strips path components from the original filename', () => {
    const file = buildFile({ originalname: '../../etc/passwd.pdf' });

    const result = service.execute(file);

    expect(result.sanitizedName).not.toContain('/');
    expect(result.sanitizedName).not.toContain('\\');
    expect(result.sanitizedName).toMatch(/^[A-Za-z0-9._-]+\.pdf$/);
  });

  it('rejects filenames that sanitize to empty', () => {
    const file = buildFile({ originalname: '/// .pdf' });

    expect(() => service.execute(file)).toThrow(ValidationException);
  });

  it.each([
    '/JavaScript',
    '/JS (alert(1))',
    '/OpenAction',
    '/Launch',
    '/EmbeddedFile',
    '/RichMedia',
    '/AA <<',
    '/SubmitForm',
  ])('rejects PDFs containing the active-content token "%s"', (token) => {
    const buffer = Buffer.concat([
      PDF_HEADER,
      Buffer.from(`\n${token}\n`),
      Buffer.alloc(50, 0x20),
      PDF_FOOTER,
    ]);
    const file = buildFile({ buffer, size: buffer.length });

    expect(() => service.execute(file)).toThrow(ValidationException);
  });

  it('truncates very long filenames', () => {
    const longStem = 'a'.repeat(500);
    const file = buildFile({ originalname: `${longStem}.pdf` });

    const result = service.execute(file);

    expect(result.sanitizedName.length).toBeLessThanOrEqual(100);
    expect(result.sanitizedName.endsWith('.pdf')).toBe(true);
  });
});
