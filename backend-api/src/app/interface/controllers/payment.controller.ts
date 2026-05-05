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
import {
  PaymentWebhookDTO,
  PaymentWebhookResourceDTO,
} from '../../application/dtos/payment/paymentWebhook.dto';
import { AuthGuardService } from '../../infrastructure/services/authGuard.service';
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

  @Get('access-status')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async accessStatus(@Request() req: AuthenticatedRequest) {
    return await this.getPaymentService.getAccessFeeStatus(req.user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getById(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.getPaymentService.getById(id, req.user.id);
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
    const resource: PaymentWebhookResourceDTO | undefined =
      body?.data ?? (queryId ? { id: queryId } : undefined);

    const normalized: PaymentWebhookDTO = {
      action: body?.action,
      type: body?.type ?? queryTopic,
      data: resource,
    };

    await this.processWebhookService.execute(headers, normalized);
    return { received: true };
  }
}
