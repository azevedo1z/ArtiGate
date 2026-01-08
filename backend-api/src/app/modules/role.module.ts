import { Module } from '@nestjs/common';
import { RoleController } from '../interface/controllers/role.controller';
import { RoleRepository } from '../infrastructure/repositories/role.repository';
import { UserRoleRepository } from '../infrastructure/repositories/userRole.repository';
import {
  RoleDatabaseAdapter,
  UserRoleDatabaseAdapter,
} from '../interface/adapter/database.adapter';
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
      provide: RoleDatabaseAdapter,
      useClass: RoleRepository,
    },
    {
      provide: UserRoleDatabaseAdapter,
      useClass: UserRoleRepository,
    },
  ],
  exports: [
    RoleDatabaseAdapter,
    UserRoleDatabaseAdapter,
    GetRoleService,
  ],
})
export class RoleModule {}
