import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GetRoleService } from '../../application/services/role/getRole.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from '../../infrastructure/services/authGuard.service';
import type { AuthenticatedRequest } from '../../shared/types/auth.types';

@Controller('role')
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly getRoleService: GetRoleService) {}

  @Get('all')
  async getAll() {
    return await this.getRoleService.getAll();
  }

  @Get('me')
  @UseGuards(AuthGuardService)
  async getMine(@Request() req: AuthenticatedRequest) {
    return await this.getRoleService.getRoleByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuardService)
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.getRoleService.getById(id);
  }
}
