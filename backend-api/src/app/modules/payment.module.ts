import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentController } from '../interface/controllers/payment.controller';
import { PaymentRepository } from '../infrastructure/repositories/payment.repository';
import { PaymentDatabaseAdapter } from '../interface/adapter/database.adapter';
import { PaymentGatewayAdapter } from '../interface/adapter/paymentGateway.adapter';
import { MercadoPagoService } from '../infrastructure/services/mercadoPago.service';
import { MockPaymentGatewayService } from '../infrastructure/services/mockPaymentGateway.service';
import { CreatePaymentService } from '../application/services/payment/createPayment.service';
import { GetPaymentService } from '../application/services/payment/getPayment.service';
import { ProcessPaymentWebhookService } from '../application/services/payment/processPaymentWebhook.service';
import { UserModule } from './user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [PaymentController],
  providers: [
    CreatePaymentService,
    GetPaymentService,
    ProcessPaymentWebhookService,
    {
      provide: PaymentDatabaseAdapter,
      useClass: PaymentRepository,
    },
    {
      provide: PaymentGatewayAdapter,
      useFactory: (configService: ConfigService): PaymentGatewayAdapter => {
        const mockEnabled = configService.get<boolean>('payment.mockEnabled');
        return mockEnabled
          ? new MockPaymentGatewayService()
          : new MercadoPagoService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [PaymentDatabaseAdapter, PaymentGatewayAdapter],
})
export class PaymentModule {}
