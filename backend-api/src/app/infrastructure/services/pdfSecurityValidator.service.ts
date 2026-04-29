import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { ValidationException } from '../../shared/exceptions/app.exception';
import { PDF_ATTACHMENT } from '../../shared/constants';
import { ValidatedPdf } from '../../shared/types/pdfServices.types';

const PDF_MAGIC_BYTES = '%PDF-';
const PDF_TRAILER_BYTES = '%%EOF';
const TRAILER_SCAN_BYTES = 1024;

const MAX_ORIGINAL_NAME_LENGTH = 100;
const SAFE_FILENAME_REGEX = /^[A-Za-z0-9._-]+$/;

const DANGEROUS_PDF_TOKENS: readonly string[] = [
  '/JavaScript',
  '/JS ',
  '/JS\n',
  '/JS\r',
  '/JS<',
  '/JS(',
  '/OpenAction',
  '/AA ',
  '/AA<',
  '/Launch',
  '/EmbeddedFile',
  '/RichMedia',
  '/Movie',
  '/SubmitForm',
  '/ImportData',
  '/GoToR',
  '/GoToE',
];

@Injectable()
export class PdfSecurityValidatorService {
  private readonly maxBytes: number;

  constructor(configService: ConfigService) {
    this.maxBytes = configService.getOrThrow<number>('attachments.maxBytes');
  }

  execute(file: Express.Multer.File): ValidatedPdf {
    this.ensureValidity(file);
    this.ensureStructureValidity(file.buffer);
    this.ensureNoActiveContent(file.buffer);

    const sanitizedName = this.sanitizeOriginalName(file.originalname);
    const checksum = this.sha256(file.buffer);

    return {
      buffer: file.buffer,
      size: file.size,
      checksum,
      sanitizedName,
    };
  }

  private ensureValidity(file: Express.Multer.File): void {
    if (!file) throw new ValidationException('A PDF file is required.');

    if (!file.buffer || file.buffer.length === 0)
      throw new ValidationException('Uploaded PDF is empty.');

    if (file.size !== file.buffer.length)
      throw new ValidationException(
        'Uploaded file size mismatch. Possible corruption or tampering.'
      );

    if (file.size > this.maxBytes)
      throw new ValidationException(
        `Uploaded PDF exceeds the maximum allowed size of ${this.maxBytes} bytes.`
      );

    if (file.size < PDF_MAGIC_BYTES.length + PDF_TRAILER_BYTES.length)
      throw new ValidationException('Uploaded PDF is too small to be valid.');

    if (file.mimetype !== PDF_ATTACHMENT.MIME_TYPE)
      throw new ValidationException(
        `Only ${PDF_ATTACHMENT.MIME_TYPE} files are accepted.`
      );
  }

  private ensureStructureValidity(buffer: Buffer): void {
    const tailStart = Math.max(0, buffer.length - TRAILER_SCAN_BYTES);

    if (buffer.indexOf(PDF_MAGIC_BYTES) !== 0)
      throw new ValidationException(
        'File content does not look like a valid PDF (invalid magic bytes).'
      );

    if (!buffer.includes(PDF_TRAILER_BYTES, tailStart))
      throw new ValidationException(
        'File content does not contain a valid PDF trailer.'
      );
  }

  private ensureNoActiveContent(buffer: Buffer): void {
    for (const token of DANGEROUS_PDF_TOKENS) {
      if (buffer.includes(token))
        throw new ValidationException(
          'PDF contains active content (scripts, embedded files or auto-actions) and was rejected.'
        );
    }
  }

  private sha256(buffer: Buffer): string {
    return createHash('sha256')
      .update(buffer as unknown as Uint8Array)
      .digest('hex');
  }

  private sanitizeOriginalName(rawName: string): string {
    if (!rawName) return `document${PDF_ATTACHMENT.EXTENSION}`;

    const stem = this.toSafeStem(rawName);

    if (!stem)
      throw new ValidationException(
        'Original filename cannot be sanitized to a safe value.'
      );

    const finalName = `${this.truncateStem(stem)}${PDF_ATTACHMENT.EXTENSION}`;

    if (!SAFE_FILENAME_REGEX.test(finalName))
      throw new ValidationException(
        'Original filename contains characters that are not allowed.'
      );

    return finalName;
  }

  private toSafeStem(rawName: string): string {
    const baseName = rawName.split(/[\\/]/).pop() ?? rawName;
    const ascii = baseName.normalize('NFKD').replace(/[^\x20-\x7E]/g, '');
    const compacted = ascii.trim().replace(/\s+/g, '_');

    const stem = compacted.toLowerCase().endsWith(PDF_ATTACHMENT.EXTENSION)
      ? compacted.slice(0, -PDF_ATTACHMENT.EXTENSION.length)
      : compacted;

    return stem
      .replace(/[^A-Za-z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^[._-]+/, '')
      .replace(/[._-]+$/, '');
  }

  private truncateStem(stem: string): string {
    const maxStemLength =
      MAX_ORIGINAL_NAME_LENGTH - PDF_ATTACHMENT.EXTENSION.length;
    return stem.length > maxStemLength ? stem.slice(0, maxStemLength) : stem;
  }
}
