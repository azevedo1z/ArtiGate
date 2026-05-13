import { Module } from '@nestjs/common';
import { RoleController } from '../interface/controllers/role.controller';
import { PrismaRoleRepository } from '../infrastructure/repositories/role.repository';
import { PrismaUserRoleRepository } from '../infrastructure/repositories/userRole.repository';
import { RoleRepository } from '../interface/repositories/role.repository.port';
import { UserRoleRepository } from '../interface/repositories/userRole.repository.port';
import { CreateRoleService } from '../application/services/role/createRole.service';
import { GetRoleService } from '../application/services/role/getRole.service';
import { UpdateRoleService } from '../application/services/role/updateRole.service';
import { DeleteRoleService } from '../application/services/role/deleteRole.service';

@Module({
  controllers: [RoleController],
  providers: [
    CreateRoleService,
    GetRoleService,
    UpdateRoleService,
    DeleteRoleService,
    {
      provide: RoleRepository,
      useClass: PrismaRoleRepository,
    },
    {
      provide: UserRoleRepository,
      useClass: PrismaUserRoleRepository,
    },
  ],
  exports: [RoleRepository, UserRoleRepository, GetRoleService],
})
export class RoleModule {}
