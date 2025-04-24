import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CreateUserService } from '../application/services/user/createUser.service';
import { CreateUserDTO } from '../application/dtos/user/createUser.dto';
import { GetUserService } from '../application/services/user/getUser.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../infrastructure/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly getUserService: GetUserService,
    private readonly authService: AuthService
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
  @ApiBearerAuth()
  @UseGuards()
  async getAll() {
    return this.getUserService.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards()
  async getById(@Param('id') id: string) {
    return this.getUserService.getById(id);
  }

  @Get('allRoles')
  @ApiBearerAuth()
  @UseGuards()
  async getAllRoles() {
    return this.getUserService.getAllRoles();
  }

  @Get('rolesBy/{userId}')
  @ApiBearerAuth()
  @UseGuards()
  async getRolesByUserId(@Param('userId') userId: string) {
    return this.getUserService.getRolesByUserId(userId);
  }

  @Post('signIn')
  @ApiBearerAuth()
  @UseGuards()
  async signIn(@Body() email: string, password: string) {
    return this.authService.signIn(email, password);
  }
}
