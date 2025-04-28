import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateRoleService } from '../application/services/role/createRole.service';
import { CreateRoleDTO } from '../application/dtos/role/createRole.dto';
import { GetRoleService } from '../application/services/role/getRole.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from '../infrastructure/authGuard.service';

@Controller('role')
export class RoleController {
  constructor(
    private readonly createRoleService: CreateRoleService,
    private readonly getRoleService: GetRoleService
  ) {}

  @Post('create')
  async create(@Body() data: CreateRoleDTO) {
    return await this.createRoleService.execute(data);
  }

  @Get('allRoles')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getAll() {
    return await this.getRoleService.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuardService)
  async getById(@Param('id') id: string) {
    return await this.getRoleService.getById(id);
  }
}
