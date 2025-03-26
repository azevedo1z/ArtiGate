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

  @Get('allUsers')
  async getAll() {
    return this.getUserService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getUserService.getById(id);
  }
}
