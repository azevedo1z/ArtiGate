import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateRoleService } from '../application/services/role/createRole.service';
import { CreateRoleDTO } from '../application/dtos/role/createRole.dto';
import { GetRoleService } from '../application/services/role/getRole.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from '../infrastructure/authGuard.service';

@Controller('role')
@ApiBearerAuth()
@UseGuards(AuthGuardService)
export class RoleController {
  constructor(
    private readonly createRoleService: CreateRoleService,
    private readonly getRoleService: GetRoleService
  ) {}

  @Post('create')
  async create(@Body() data: CreateRoleDTO) {
    try {
      return await this.createRoleService.execute(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('allRoles')
  async getAll() {
    try {
      return await this.getRoleService.getAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      return await this.getRoleService.getById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
