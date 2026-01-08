import { Module } from '@nestjs/common';
import { AddressController } from '../interface/controllers/address.controller';
import { AddressRepository } from '../infrastructure/repositories/address.repository';
import { AddressDatabaseAdapter } from '../interface/adapter/database.adapter';
import { CreateAddressService } from '../application/services/address/createAddress.service';
import { GetAddressService } from '../application/services/address/getAddress.service';
import { UpdateAddressService } from '../application/services/address/updateAddress.service';
import { DeleteAddressService } from '../application/services/address/deleteAddress.service';
import { forwardRef } from '@nestjs/common';
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
      provide: AddressDatabaseAdapter,
      useClass: AddressRepository,
    },
  ],
  exports: [AddressDatabaseAdapter],
})
export class AddressModule {}
