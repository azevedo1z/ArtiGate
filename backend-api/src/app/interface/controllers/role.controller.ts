import {
  BadRequestException,
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
    try {
      return await this.createRoleService.execute(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Put('update')
  @UseGuards(AuthGuardService)
  async update(@Body() data: UpdateRoleDTO) {
    try {
      return await this.updateRoleService.execute(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuardService)
  async delete(@Param('id') id: string) {
    try {
      return await this.deleteRoleService.execute(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('all')
  async getAll() {
    try {
      return await this.getRoleService.getAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuardService)
  async getById(@Param('id') id: string) {
    try {
      return await this.getRoleService.getById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
