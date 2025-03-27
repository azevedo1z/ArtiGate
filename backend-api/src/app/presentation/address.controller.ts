import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateAddressDTO } from '../application/dtos/address/createAddress.dto';
import { CreateAddressService } from '../application/services/address/createAddress.service';
import { GetAddressService } from '../application/services/address/getAddress.service';

@Controller('address')
export class AddressController {
  constructor(
    private readonly createAddressService: CreateAddressService,
    private readonly getAddressService: GetAddressService
  ) {}

  @Post('create')
  async create(@Body() data: CreateAddressDTO) {
    return this.createAddressService.execute(data);
  }

  @Get('allAddresses')
  async getAll() {
    return this.getAddressService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getAddressService.getById(id);
  }
}
