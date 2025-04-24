import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CreateUserService } from '../application/services/user/createUser.service';
import { CreateUserDTO } from '../application/dtos/user/createUser.dto';
import { GetUserService } from '../application/services/user/getUser.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../infrastructure/auth.service';
import { AuthUserDTO } from '../application/dtos/user/authUser.dto';
import { AuthGuardService } from '../infrastructure/authGuard.service';

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

  @Post('signIn')
  async signIn(@Body() data: AuthUserDTO) {
    return this.authService.signIn(data);
  }

  @Get('allUsers')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getAll() {
    return this.getUserService.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getById(@Param('id') id: string) {
    return this.getUserService.getById(id);
  }

  @Get('allRoles')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getAllRoles() {
    return this.getUserService.getAllRoles();
  }

  @Get('rolesBy/{userId}')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getRolesByUserId(@Param('userId') userId: string) {
    return this.getUserService.getRolesByUserId(userId);
  }
}
