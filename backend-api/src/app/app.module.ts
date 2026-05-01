import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './modules/user.module';
import { RoleModule } from './modules/role.module';
import { AddressModule } from './modules/address.module';
import { ArticleModule } from './modules/article.module';
import { ReviewModule } from './modules/review.module';
import { ZipCodeModule } from './modules/zipCode.module';
import { PaymentModule } from './modules/payment.module';

@Module({
  imports: [
    SharedModule,
    UserModule,
    RoleModule,
    AddressModule,
    ArticleModule,
    ReviewModule,
    ZipCodeModule,
    PaymentModule,
  ],
})
export class AppModule {}
