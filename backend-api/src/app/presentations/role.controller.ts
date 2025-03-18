import { Body, Controller, Post } from '@nestjs/common';
import { CreateRoleService } from '../applications/services/role/createRole.service';
import { CreateRoleDTO } from '../applications/dtos/role/createRole.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly createRoleService: CreateRoleService) {}

  @Post('create')
  async create(@Body() data: CreateRoleDTO) {
    return this.createRoleService.execute(data);
  }
}
