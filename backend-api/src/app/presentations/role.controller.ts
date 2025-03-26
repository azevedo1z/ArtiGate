import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoleService } from '../applications/services/role/createRole.service';
import { CreateRoleDTO } from '../applications/dtos/role/createRole.dto';
import { GetRoleService } from '../applications/services/role/getRole.service';

@Controller('role')
export class RoleController {
  constructor(
    private readonly createRoleService: CreateRoleService,
    private readonly getRoleService: GetRoleService
  ) {}

  @Post('create')
  async create(@Body() data: CreateRoleDTO) {
    return this.createRoleService.execute(data);
  }

  @Get('allRoles')
  async getAll() {
    return this.getRoleService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getRoleService.getById(id);
  }
}
