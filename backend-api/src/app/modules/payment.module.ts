import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentController } from '../interface/controllers/payment.controller';
import { PrismaPaymentRepository } from '../infrastructure/repositories/payment.repository';
import { PaymentRepository } from '../interface/repositories/payment.repository.port';
import { PaymentGateway } from '../interface/gateways/paymentGateway.port';
import { MercadoPagoService } from '../infrastructure/services/mercadoPago.service';
import { MockPaymentGatewayService } from '../infrastructure/services/mockPaymentGateway.service';
import { CreatePaymentService } from '../application/services/payment/createPayment.service';
import { GetPaymentService } from '../application/services/payment/getPayment.service';
import { ProcessPaymentWebhookService } from '../application/services/payment/processPaymentWebhook.service';
import { AccessFeePaymentGuard } from '../infrastructure/services/accessFeePayment.guard';
import { UserModule } from './user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [PaymentController],
  providers: [
    CreatePaymentService,
    GetPaymentService,
    ProcessPaymentWebhookService,
    AccessFeePaymentGuard,
    {
      provide: PaymentRepository,
      useClass: PrismaPaymentRepository,
    },
    {
      provide: PaymentGateway,
      useFactory: (configService: ConfigService): PaymentGateway => {
        const mockEnabled = configService.get<boolean>('payment.mockEnabled');
        return mockEnabled
          ? new MockPaymentGatewayService()
          : new MercadoPagoService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    PaymentRepository,
    PaymentGateway,
    AccessFeePaymentGuard,
    GetPaymentService,
  ],
})
export class PaymentModule {}
