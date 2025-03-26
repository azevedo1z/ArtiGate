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
import { ArticleController } from './presentations/article.controller';
import { CreateArticleService } from './applications/services/article/createArticle.service';
import { ArticleRepository } from './domain/repositories/article.repository';
import { ArticleRepositoryImplementation } from './domain/repositories/article.repositoryImplementation';
import { GetUserService } from './applications/services/user/getUser.service';
import { GetRoleService } from './applications/services/role/getRole.service';
import { GetAddressService } from './applications/services/address/getAddress.service';

@Module({
  imports: [],
  controllers: [
    UserController,
    AddressController,
    RoleController,
    ArticleController,
  ],
  providers: [
    PrismaService,
    CreateUserService,
    CreateAddressService,
    CreateRoleService,
    CreateArticleService,
    GetUserService,
    GetRoleService,
    GetAddressService,
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
    {
      provide: ArticleRepository,
      useClass: ArticleRepositoryImplementation,
    },
  ],
})
export class AppModule {}
