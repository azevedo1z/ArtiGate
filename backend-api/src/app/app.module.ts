import { Module } from '@nestjs/common';
import { UserController } from './presentations/user.controller';
import { CreateUserService } from './applications/services/user/createUser.service';
import { UserRepositoryImplementation } from './domain/repositories/user.repositoryImplementation';
import { PrismaService } from './infrastructure/prisma.service';
import { UserRepository } from './domain/repositories/user.repository';
import { AddressRepository } from './domain/repositories/address.repository';
import { AddressRepositoryImplementation } from './domain/repositories/address.repositoryImplementation';
import { AddressController } from './presentations/address.controller';
import { CreateAddressService } from './applications/services/address/createAddress.service';
import { RoleController } from './presentations/role.controller';
import { CreateRoleService } from './applications/services/role/createRole.service';
import { RoleRepository } from './domain/repositories/role.repository';
import { RoleRepositoryImplementation } from './domain/repositories/role.repositoryImplementation';

@Module({
  imports: [],
  controllers: [UserController, AddressController, RoleController],
  providers: [
    PrismaService,
    CreateUserService,
    CreateAddressService,
    CreateRoleService,
    {
      provide: UserRepository,
      useClass: UserRepositoryImplementation,
    },
    {
      provide: AddressRepository,
      useClass: AddressRepositoryImplementation,
    },
    {
      provide: RoleRepository,
      useClass: RoleRepositoryImplementation,
    },
  ],
})
export class AppModule {}
