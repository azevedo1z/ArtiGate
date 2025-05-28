import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/services/prisma.service';
import {
  AddressDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
  ArticleDatabaseAdapter,
  ReviewDatabaseAdapter,
  RoleDatabaseAdapter,
  UserDatabaseAdapter,
  UserRoleDatabaseAdapter,
} from './interface/adapter/database.adapter';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './infrastructure/services/auth.service';
import { AuthGuardService } from './infrastructure/services/authGuard.service';
import { UserController } from './interface/controllers/user.controller';
import { AddressController } from './interface/controllers/address.controller';
import { RoleController } from './interface/controllers/role.controller';
import { ArticleController } from './interface/controllers/article.controller';
import { ReviewController } from './interface/controllers/review.controller';
import { ArticleAuthorController } from './interface/controllers/articleAuthor.controller';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { AddressRepository } from './infrastructure/repositories/address.repository';
import { RoleRepository } from './infrastructure/repositories/role.repository';
import { ArticleRepository } from './infrastructure/repositories/article.repository';
import { ReviewRepository } from './infrastructure/repositories/review.repository';
import { ArticleAuthorRepository } from './infrastructure/repositories/articleAuthor.repository';
import { UserRoleRepository } from './infrastructure/repositories/userRole.repository';
import { CreateUserService } from './application/services/user/createUser.service';
import { GetUserService } from './application/services/user/getUser.service';
import { UpdateUserService } from './application/services/user/updateUser.service';
import { DeleteUserService } from './application/services/user/deleteUser.service';
import { CreateRoleService } from './application/services/role/createRole.service';
import { GetRoleService } from './application/services/role/getRole.service';
import { CreateAddressService } from './application/services/address/createAddress.service';
import { GetAddressService } from './application/services/address/getAddress.service';
import { UpdateAddressService } from './application/services/address/updateAddress.service';
import { DeleteAddressService } from './application/services/address/deleteAddress.service';
import { CreateArticleService } from './application/services/article/createArticle.service';
import { GetArticleService } from './application/services/article/getArticle.service';
import { UpdateArticleService } from './application/services/article/updateArticle.service';
import { DeleteArticleService } from './application/services/article/deleteArticle.service';
import { CreateReviewService } from './application/services/review/createReview.service';
import { GetReviewService } from './application/services/review/getReview.service';
import { UpdateReviewService } from './application/services/review/updateReview.service';
import { DeleteReviewService } from './application/services/review/deleteReview.service';
import { UpdateRoleService } from './application/services/role/updateRole.service';
import { DeleteRoleService } from './application/services/role/deleteRole.service';
import { GetArticleAuthorService } from './application/services/articleAuthor/getArticleAuthor.service';
import { UpdateArticleAuthorService } from './application/services/articleAuthor/updateArticleAuthor.service';
import { GetUserRoleService } from './application/services/userRole/getUserRole.service';
import { UserRoleController } from './interface/controllers/userRole.controller';
import { CreateArticleAuthorService } from './application/services/articleAuthor/createArticleAuthor.service';

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
    ArticleAuthorController,
    UserRoleController,
  ],
  providers: [
    PrismaService,
    AuthService,
    AuthGuardService,
    CreateUserService,
    GetUserService,
    UpdateUserService,
    DeleteUserService,
    CreateAddressService,
    GetAddressService,
    UpdateAddressService,
    DeleteAddressService,
    CreateArticleService,
    GetArticleService,
    UpdateArticleService,
    DeleteArticleService,
    CreateReviewService,
    GetReviewService,
    UpdateReviewService,
    DeleteReviewService,
    CreateRoleService,
    GetRoleService,
    UpdateRoleService,
    DeleteRoleService,
    CreateArticleAuthorService,
    GetArticleAuthorService,
    UpdateArticleAuthorService,
    GetUserRoleService,
    {
      provide: UserDatabaseAdapter,
      useClass: UserRepository,
    },
    {
      provide: AddressDatabaseAdapter,
      useClass: AddressRepository,
    },
    {
      provide: RoleDatabaseAdapter,
      useClass: RoleRepository,
    },
    {
      provide: ArticleDatabaseAdapter,
      useClass: ArticleRepository,
    },
    {
      provide: ReviewDatabaseAdapter,
      useClass: ReviewRepository,
    },
    {
      provide: ArticleAuthorDatabaseAdapter,
      useClass: ArticleAuthorRepository,
    },
    {
      provide: UserRoleDatabaseAdapter,
      useClass: UserRoleRepository,
    },
  ],
  exports: [
    UserDatabaseAdapter,
    RoleDatabaseAdapter,
    ReviewDatabaseAdapter,
    UserRoleDatabaseAdapter,
    ArticleDatabaseAdapter,
    ArticleDatabaseAdapter,
    AddressDatabaseAdapter,
  ],
})
export class AppModule {}
