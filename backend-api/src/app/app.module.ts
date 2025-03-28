import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { CreateUserService } from './application/services/user/createUser.service';
import { UserRepositoryImplementation } from './domain/repositories/user.repositoryImplementation';
import { PrismaService } from './infrastructure/prisma.service';
import { UserRepository } from './domain/repositories/user.repository';
import { AddressRepository } from './domain/repositories/address.repository';
import { AddressRepositoryImplementation } from './domain/repositories/address.repositoryImplementation';
import { AddressController } from './presentation/address.controller';
import { CreateAddressService } from './application/services/address/createAddress.service';
import { RoleController } from './presentation/role.controller';
import { CreateRoleService } from './application/services/role/createRole.service';
import { RoleRepository } from './domain/repositories/role.repository';
import { RoleRepositoryImplementation } from './domain/repositories/role.repositoryImplementation';
import { ArticleController } from './presentation/article.controller';
import { CreateArticleService } from './application/services/article/createArticle.service';
import { ArticleRepository } from './domain/repositories/article.repository';
import { ArticleRepositoryImplementation } from './domain/repositories/article.repositoryImplementation';
import { GetUserService } from './application/services/user/getUser.service';
import { GetRoleService } from './application/services/role/getRole.service';
import { GetAddressService } from './application/services/address/getAddress.service';
import { GetArticleService } from './application/services/article/getArticle.service';
import { ReviewController } from './presentation/review.controller';
import { ReviewRepository } from './domain/repositories/review.repository';
import { ReviewRepositoryImplementation } from './domain/repositories/review.repositoryImplementation';
import { GetReviewService } from './application/services/review/getReview.service';

@Module({
  imports: [],
  controllers: [
    UserController,
    AddressController,
    RoleController,
    ArticleController,
    ReviewController,
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
    GetArticleService,
    GetReviewService,
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
    {
      provide: ReviewRepository,
      useClass: ReviewRepositoryImplementation,
    },
  ],
})
export class AppModule {}
