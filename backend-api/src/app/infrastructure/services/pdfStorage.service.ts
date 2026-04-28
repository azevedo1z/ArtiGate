import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { createReadStream, mkdirSync } from 'fs';
import { rename, unlink, writeFile } from 'fs/promises';
import { resolve, sep } from 'path';
import { Readable } from 'stream';
import {
  AppException,
  NotFoundException,
} from '../../shared/exceptions/app.exception';

@Injectable()
export class PdfStorageService implements OnModuleInit {
  private readonly logger = new Logger(PdfStorageService.name);
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = resolve(
      this.configService.getOrThrow<string>('attachments.uploadDir')
    );
  }

  onModuleInit(): void {
    mkdirSync(this.uploadDir, { recursive: true, mode: 0o700 });
    this.logger.log(`PDF upload directory ready at "${this.uploadDir}".`);
  }

  generateStoredName(): string {
    return `${randomUUID()}.pdf`;
  }

  async write(storedName: string, buffer: Buffer): Promise<void> {
    const finalPath = this.resolveSafePath(storedName);
    const tempPath = `${finalPath}.${randomUUID()}.tmp`;

    try {
      await writeFile(tempPath, new Uint8Array(buffer), {
        mode: 0o600,
        flag: 'wx',
      });
      await rename(tempPath, finalPath);
    } catch (error) {
      await this.safeDelete(tempPath);
      throw new AppException(
        `Failed to persist uploaded PDF: ${(error as Error).message}`
      );
    }
  }

  openReadStream(storedName: string): Readable {
    const filePath = this.resolveSafePath(storedName);
    const stream = createReadStream(filePath);

    stream.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'ENOENT') {
        this.logger.warn(`Attachment file missing on disk: ${storedName}`);
      } else {
        this.logger.error(
          `Error streaming attachment ${storedName}: ${err.message}`
        );
      }
    });

    return stream;
  }

  async ensureExists(storedName: string): Promise<void> {
    const filePath = this.resolveSafePath(storedName);
    const fs = await import('fs/promises');

    try {
      await fs.access(filePath);
    } catch {
      throw new NotFoundException(
        'The attachment file is no longer available on disk.'
      );
    }
  }

  async delete(storedName: string): Promise<void> {
    const filePath = this.resolveSafePath(storedName);
    await this.safeDelete(filePath);
  }

  private resolveSafePath(storedName: string): string {
    if (
      typeof storedName !== 'string' ||
      storedName.length === 0 ||
      storedName.length > 256 ||
      storedName.includes('/') ||
      storedName.includes('\\') ||
      storedName.includes('\0') ||
      storedName.includes('..')
    )
      throw new AppException('Invalid stored attachment name.');

    const candidate = resolve(this.uploadDir, storedName);
    const root = this.formatUploadDirectory();

    if (!candidate.startsWith(root))
      throw new AppException(
        'Resolved attachment path is outside upload root.'
      );

    return candidate;
  }

  private formatUploadDirectory() {
    return this.uploadDir.endsWith(sep)
      ? this.uploadDir
      : this.uploadDir + sep;
  }

  private async safeDelete(filePath: string): Promise<void> {
    try {
      await unlink(filePath);
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code && code !== 'ENOENT')
        this.logger.warn(
          `Failed to delete file "${filePath}": ${(err as Error).message}`
        );
    }
  }
}
