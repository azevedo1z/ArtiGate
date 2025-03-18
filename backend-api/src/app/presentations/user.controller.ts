import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserService } from '../applications/services/user/createUser.service';
import { CreateUserDTO } from '../applications/dtos/user/createUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('create')
  async create(@Body() data: CreateUserDTO) {
    return this.createUserService.execute(
      data,
      data.homeAddress,
      data.jobAddress
    );
  }
}
