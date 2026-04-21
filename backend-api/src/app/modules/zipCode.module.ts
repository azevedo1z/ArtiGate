import { Module } from '@nestjs/common';
import { ZipCodeController } from '../interface/controllers/zipCode.controller';
import { ZipCodeLookupAdapter } from '../interface/adapter/zipCodeLookup.adapter';
import { BrasilApiCepService } from '../infrastructure/services/brasilApiCep.service';
import { LookupZipCodeService } from '../application/services/zipCode/lookupZipCode.service';

@Module({
  controllers: [ZipCodeController],
  providers: [
    LookupZipCodeService,
    {
      provide: ZipCodeLookupAdapter,
      useClass: BrasilApiCepService,
    },
  ],
  exports: [ZipCodeLookupAdapter],
})
export class ZipCodeModule {}
