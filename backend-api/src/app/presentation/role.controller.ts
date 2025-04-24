import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoleService } from '../application/services/role/createRole.service';
import { CreateRoleDTO } from '../application/dtos/role/createRole.dto';
import { GetRoleService } from '../application/services/role/getRole.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('role')
export class RoleController {
  constructor(
    private readonly createRoleService: CreateRoleService,
    private readonly getRoleService: GetRoleService
  ) {}

  @Post('create')
  @ApiBearerAuth()
  async create(@Body() data: CreateRoleDTO) {
    return this.createRoleService.execute(data);
  }

  @Get('allRoles')
  @ApiBearerAuth()
  async getAll() {
    return this.getRoleService.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  async getById(@Param('id') id: string) {
    return this.getRoleService.getById(id);
  }
}
