import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserService } from '../../application/services/user/createUser.service';
import { CreateUserDTO } from '../../application/dtos/user/createUser.dto';
import { GetUserService } from '../../application/services/user/getUser.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../../infrastructure/services/auth.service';
import { AuthUserDTO } from '../../application/dtos/user/authUser.dto';
import { AuthGuardService } from '../../infrastructure/services/authGuard.service';
import { UpdateUserDTO } from '../../application/dtos/user/updateUser.dto';
import { UpdateUserService } from '../../application/services/user/updateUser.service';
import { DeleteUserService } from '../../application/services/user/deleteUser.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly createUserService: CreateUserService,
    private readonly getUserService: GetUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService
  ) {}

  @Post('signIn')
  async signIn(@Body() data: AuthUserDTO) {
    try {
      return await this.authService.signIn(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('create')
  async create(@Body() data: CreateUserDTO) {
    try {
      return await this.createUserService.execute(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('update')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async update(@Body() data: UpdateUserDTO) {
    try {
      return await this.updateUserService.execute(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('delete')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async delete(@Body() id: string) {
    try {
      return await this.deleteUserService.execute(id);
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
}
