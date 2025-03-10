import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserService } from '../applications/services/user/createUser.service';
import { CreateUserDTO } from '../applications/dtos/user/createUser.dto';
import { CreateAddressDTO } from '../applications/dtos/address/createAddress.dto';

@Controller('user')
export class UserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('create')
  async create(
    @Body() data: CreateUserDTO,
    homeAddressData: CreateAddressDTO,
    jobAddressData: CreateAddressDTO
  ) {
    return this.createUserService.execute(
      data,
      homeAddressData,
      jobAddressData
    );
  }
}