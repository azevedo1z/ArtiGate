import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import { DeleteAddressService } from '../application/services/address/deleteAddress.service';

@Controller('address')
export class AddressController {
  constructor(
    private readonly createAddressService: CreateAddressService,
    private readonly getAddressService: GetAddressService,
    private readonly updateAddressService: UpdateAddressService,
    private readonly deleteAddressService: DeleteAddressService
  ) {}

  @Post('create')
  async create(@Body() data: CreateAddressDTO) {
    try {
      return await this.createAddressService.execute(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Put('update')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async update(@Body() data: UpdateAddressDTO) {
    try {
      return await this.updateAddressService.execute(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete('delete')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async delete(@Body() id: string) {
    try {
      return await this.deleteAddressService.execute(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getById(@Param('id') id: string) {
    try {
      return await this.getAddressService.getById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('allAddresses')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getAll() {
    try {
      return await this.getAddressService.getAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
