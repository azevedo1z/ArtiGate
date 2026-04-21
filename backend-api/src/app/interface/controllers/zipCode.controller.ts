import { Controller, Get, Param } from '@nestjs/common';
import { LookupZipCodeService } from '../../application/services/zipCode/lookupZipCode.service';

@Controller('zip-code')
export class ZipCodeController {
  constructor(private readonly lookupZipCodeService: LookupZipCodeService) {}

  @Get(':zipCode')
  async lookup(@Param('zipCode') zipCode: string) {
    return await this.lookupZipCodeService.execute(zipCode);
  }
}
