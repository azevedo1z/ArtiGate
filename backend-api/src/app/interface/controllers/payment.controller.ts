import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CreatePaymentService } from '../../application/services/payment/createPayment.service';
import { GetPaymentService } from '../../application/services/payment/getPayment.service';
import { ProcessPaymentWebhookService } from '../../application/services/payment/processPaymentWebhook.service';
import { CreatePaymentDTO } from '../../application/dtos/payment/createPayment.dto';
import { PaymentWebhookDTO } from '../../application/dtos/payment/paymentWebhook.dto';
import { AuthGuardService } from '../../infrastructure/services/authGuard.service';
import { PaginationDTO } from '../../shared/dtos/pagination.dto';
import type { AuthenticatedRequest } from '../../shared/types/auth.types';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly createPaymentService: CreatePaymentService,
    private readonly getPaymentService: GetPaymentService,
    private readonly processWebhookService: ProcessPaymentWebhookService
  ) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() data: CreatePaymentDTO
  ) {
    return await this.createPaymentService.execute(req.user.id, data);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async listMine(@Request() req: AuthenticatedRequest) {
    return await this.getPaymentService.getByUserId(req.user.id);
  }

  @Get('all')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getAll(@Query() pagination: PaginationDTO) {
    return await this.getPaymentService.getAll(pagination);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.getPaymentService.getById(id);
  }

  @Post('webhook')
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Headers() headers: Record<string, string | undefined>,
    @Body() body: PaymentWebhookDTO,
    @Query('id') queryId?: string,
    @Query('topic') queryTopic?: string
  ) {
    const normalized: PaymentWebhookDTO = {
      action: body?.action,
      type: body?.type ?? queryTopic,
      data: body?.data ?? (queryId ? { id: queryId } : ({} as never)),
    };
    await this.processWebhookService.execute(headers, normalized);
    return { received: true };
  }
}
