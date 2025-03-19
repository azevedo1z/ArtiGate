import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateUserService } from '../applications/services/user/createUser.service';
import { CreateUserDTO } from '../applications/dtos/user/createUser.dto';
import { GetUserService } from '../applications/services/user/getUser.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly getUserService: GetUserService
  ) {}

  @Post('create')
  async create(@Body() data: CreateUserDTO) {
    return this.createUserService.execute(
      data,
      data.homeAddress,
      data.jobAddress
    );
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.getUserService.execute(id);
  }
}
