import {
  BadRequestException,
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuardService } from '../../infrastructure/services/authGuard.service';
import { GetUserRoleService } from '../../application/services/userRole/getUserRole.service';

@Controller('userRole')
@ApiBearerAuth()
@UseGuards(AuthGuardService)
export class UserRoleController {
  constructor(private readonly getUserRoleService: GetUserRoleService) {}

  @Get('allUserRoles')
  async getAll() {
    try {
      return await this.getUserRoleService.getAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
