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
import { CreateReviewService } from './application/services/review/createReview.service';
import { AuthService } from './infrastructure/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuardService } from './infrastructure/authGuard.service';
import { UpdateAddressService } from './application/services/address/updateAddress.service';
import { DeleteAddressService } from './application/services/address/deleteAddress.service';
import { DeleteArticleService } from './application/services/article/deleteArticle.service';
import { UpdateArticleService } from './application/services/article/updateArticle.service';
import { UpdateReviewService } from './application/services/review/updateReview.service';
import { DeleteReviewService } from './application/services/review/deleteReview.service';
import { UpdateRoleService } from './application/services/role/updateRole.service';
import { DeleteRoleService } from './application/services/role/deleteRole.service';
import { UpdateUserService } from './application/services/user/updateUser.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
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
    CreateReviewService,
    GetUserService,
    GetRoleService,
    GetAddressService,
    GetArticleService,
    GetReviewService,
    AuthService,
    AuthGuardService,
    UpdateAddressService,
    DeleteAddressService,
    DeleteArticleService,
    UpdateArticleService,
    UpdateReviewService,
    DeleteReviewService,
    UpdateRoleService,
    DeleteRoleService,
    UpdateUserService,
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
