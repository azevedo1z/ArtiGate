import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
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
    try {
      return await this.createUserService.execute(
        data,
        data.homeAddress,
        data.jobAddress
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('signIn')
  async signIn(@Body() data: AuthUserDTO) {
    try {
      return await this.authService.signIn(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('allUsers')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getAll() {
    try {
      return await this.getUserService.getAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getById(@Param('id') id: string) {
    try {
      return await this.getUserService.getById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('allRoles')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getAllRoles() {
    try {
      return await this.getUserService.getAllRoles();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('rolesBy/{userId}')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getRolesByUserId(@Param('userId') userId: string) {
    try {
      return await this.getUserService.getRolesByUserId(userId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
