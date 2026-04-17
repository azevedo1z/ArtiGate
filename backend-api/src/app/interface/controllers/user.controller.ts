import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  Put,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PaginationDTO } from '../../shared/dtos/pagination.dto';
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
import type { AuthenticatedRequest } from '../../shared/types/auth.types';

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
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() data: AuthUserDTO) {
    return await this.authService.signIn(data);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateUserDTO) {
    return await this.createUserService.execute(data);
  }

  @Put('update')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async update(@Body() data: UpdateUserDTO) {
    return await this.updateUserService.execute(data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deleteUserService.execute(id);
  }

  @Get('all')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getAll(@Query() pagination: PaginationDTO) {
    return await this.getUserService.getAll(pagination);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getAuthenticatedUser(@Request() req: AuthenticatedRequest) {
    return await this.getUserService.getById(req.user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.getUserService.getById(id);
  }
}
