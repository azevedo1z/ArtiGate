import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateAddressDTO } from '../application/dtos/address/createAddress.dto';
import { CreateAddressService } from '../application/services/address/createAddress.service';
import { GetAddressService } from '../application/services/address/getAddress.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from '../infrastructure/authGuard.service';
import { UpdateAddressDTO } from '../application/dtos/address/updateAddress.dto';
import { UpdateAddressService } from '../application/services/address/updateAddress.service';

@Controller('address')
export class AddressController {
  constructor(
    private readonly createAddressService: CreateAddressService,
    private readonly getAddressService: GetAddressService,
    private readonly updateAddressService: UpdateAddressService
  ) {}

  @Post('create')
  async create(@Body() data: CreateAddressDTO) {
    return await this.createAddressService.execute(data);
  }

  @Put('update')
  async update(@Body() data: UpdateAddressDTO) {
    const address = await this.getAddressService.getById(data.id);

    return this.updateAdressService.execute(data);
  }

  @Get('allAddresses')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getAll() {
    return await this.getAddressService.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getById(@Param('id') id: string) {
    return await this.getAddressService.getById(id);
  }
}
