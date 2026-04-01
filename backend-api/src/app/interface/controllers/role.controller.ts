import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateRoleService } from '../../application/services/role/createRole.service';
import { CreateRoleDTO } from '../../application/dtos/role/createRole.dto';
import { GetRoleService } from '../../application/services/role/getRole.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from '../../infrastructure/services/authGuard.service';
import { UpdateRoleDTO } from '../../application/dtos/role/updateRole.dto';
import { UpdateRoleService } from '../../application/services/role/updateRole.service';
import { DeleteRoleService } from '../../application/services/role/deleteRole.service';

@Controller('role')
@ApiBearerAuth()
export class RoleController {
  constructor(
    private readonly createRoleService: CreateRoleService,
    private readonly getRoleService: GetRoleService,
    private readonly updateRoleService: UpdateRoleService,
    private readonly deleteRoleService: DeleteRoleService
  ) {}

  @Post('create')
  @UseGuards(AuthGuardService)
  async create(@Body() data: CreateRoleDTO) {
    return await this.createRoleService.execute(data);
  }

  @Put('update')
  @UseGuards(AuthGuardService)
  async update(@Body() data: UpdateRoleDTO) {
    return await this.updateRoleService.execute(data);
  }

  @Delete(':id')
  @UseGuards(AuthGuardService)
  async delete(@Param('id') id: string) {
    return await this.deleteRoleService.execute(id);
  }

  @Get('all')
  async getAll() {
    return await this.getRoleService.getAll();
  }

  @Get('user/:userId')
  @UseGuards(AuthGuardService)
  async getByUserId(@Param('userId') userId: string) {
    return await this.getRoleService.getRoleByUserId(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuardService)
  async getById(@Param('id') id: string) {
    return await this.getRoleService.getById(id);
  }
}
