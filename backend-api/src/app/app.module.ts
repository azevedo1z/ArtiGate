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

@Module({
  imports: [],
  controllers: [UserController, AddressController],
  providers: [
    PrismaService,
    CreateUserService,
    CreateAddressService,
    {
      provide: UserRepository,
      useClass: UserRepositoryImplementation,
    },
    {
      provide: AddressRepository,
      useClass: AddressRepositoryImplementation,
    },
  ],
})
export class AppModule {}
