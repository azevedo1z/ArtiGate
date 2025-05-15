import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/services/prisma.service';
import { DatabaseAdapter } from './interface/adapter/database.adapter';
import { AuthService } from './infrastructure/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuardService } from './infrastructure/services/authGuard.service';
import { UserController } from './interface/controllers/user.controller';
import { AddressController } from './interface/controllers/address.controller';
import { RoleController } from './interface/controllers/role.controller';
import { ArticleController } from './interface/controllers/article.controller';
import { ReviewController } from './interface/controllers/review.controller';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { AddressRepository } from './infrastructure/repositories/address.repository';
import { RoleRepository } from './infrastructure/repositories/role.repository';
import { ArticleRepository } from './infrastructure/repositories/article.repository';
import { ReviewRepository } from './infrastructure/repositories/review.repository';
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
    {
      provide: DatabaseAdapter,
      useClass: UserRepository,
    },
    {
      provide: DatabaseAdapter,
      useClass: AddressRepository,
    },
    {
      provide: DatabaseAdapter,
      useClass: RoleRepository,
    },
    {
      provide: DatabaseAdapter,
      useClass: ArticleRepository,
    },
    {
      provide: DatabaseAdapter,
      useClass: ReviewRepository,
    },
  ],
})
export class AppModule {}
