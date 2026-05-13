import { Module, forwardRef } from '@nestjs/common';
import { AddressController } from '../interface/controllers/address.controller';
import { PrismaAddressRepository } from '../infrastructure/repositories/address.repository';
import { AddressRepository } from '../interface/repositories/address.repository.port';
import { CreateAddressService } from '../application/services/address/createAddress.service';
import { GetAddressService } from '../application/services/address/getAddress.service';
import { UpdateAddressService } from '../application/services/address/updateAddress.service';
import { DeleteAddressService } from '../application/services/address/deleteAddress.service';
import { UserModule } from './user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [AddressController],
  providers: [
    CreateAddressService,
    GetAddressService,
    UpdateAddressService,
    DeleteAddressService,
    {
      provide: AddressRepository,
      useClass: PrismaAddressRepository,
    },
  ],
  exports: [AddressRepository],
})
export class AddressModule {}
