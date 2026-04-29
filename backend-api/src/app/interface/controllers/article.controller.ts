import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  applyDecorators,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiProduces,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { PaginationDTO } from '../../shared/dtos/pagination.dto';
import { CreateArticleDTO } from '../../application/dtos/article/createArticle.dto';
import { UpdateArticleDTO } from '../../application/dtos/article/updateArticle.dto';
import { GetArticleService } from '../../application/services/article/getArticle.service';
import { DeleteArticleService } from '../../application/services/article/deleteArticle.service';
import { UpdateArticleService } from '../../application/services/article/updateArticle.service';
import { SubmitArticleService } from '../../application/services/article/submitArticle.service';
import { DownloadArticleAttachmentService } from '../../application/services/articleAttachment/downloadArticleAttachment.service';
import { AuthGuardService } from '../../infrastructure/services/authGuard.service';
import {
  PDF_ATTACHMENT,
  PDF_DOWNLOAD_SECURITY_HEADERS,
} from '../../shared/constants';
import type { AuthenticatedRequest } from '../../shared/types/auth.types';

@Controller('article')
@ApiBearerAuth()
@UseGuards(AuthGuardService)
export class ArticleController {
  constructor(
    private readonly submitArticleService: SubmitArticleService,
    private readonly getArticleService: GetArticleService,
    private readonly deleteArticleService: DeleteArticleService,
    private readonly updateArticleService: UpdateArticleService,
    private readonly downloadAttachmentService: DownloadArticleAttachmentService
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UseInterceptors(FileInterceptor('pdf'))
  @CreateArticleSwagger()
  async create(
    @Body() data: CreateArticleDTO,
    @UploadedFile() pdf: Express.Multer.File,
    @Req() req: AuthenticatedRequest
  ) {
    const { article, attachment } = await this.submitArticleService.execute(
      data,
      req.user.id,
      pdf
    );

    return {
      id: article.id,
      summary: article.summary,
      scoreAvg: article.scoreAvg,
      attachment: {
        id: attachment.id,
        originalName: attachment.originalName,
        size: attachment.size,
        checksum: attachment.checksum,
      },
    };
  }

  @Put('update')
  async update(@Body() data: UpdateArticleDTO) {
    return await this.updateArticleService.execute(data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deleteArticleService.execute(id);
  }

  @Get('all')
  async getAll(@Query() pagination: PaginationDTO) {
    return await this.getArticleService.getAll(pagination);
  }

  @Get('author/:authorId')
  async getByAuthorId(@Param('authorId', ParseUUIDPipe) authorId: string) {
    return await this.getArticleService.getByAuthorId(authorId);
  }

  @Get(':id/attachment')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiProduces(PDF_ATTACHMENT.MIME_TYPE)
  async downloadAttachment(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    const download = await this.downloadAttachmentService.execute(
      id,
      req.user.id
    );

    res.set({
      ...PDF_DOWNLOAD_SECURITY_HEADERS,
      'Content-Type': download.mimeType,
      'Content-Length': String(download.size),
      'Content-Disposition': `attachment; filename="${download.originalName}"`,
      'X-Attachment-Checksum-SHA256': download.checksum,
    });

    return new StreamableFile(download.stream);
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.getArticleService.getById(id);
  }
}

export function CreateArticleSwagger(): MethodDecorator {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['summary', 'authorIds', 'pdf'],
        properties: {
          summary: { type: 'string' },
          authorIds: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
            ],
          },
          pdf: { type: 'string', format: 'binary' },
        },
      },
    })
  );
}
