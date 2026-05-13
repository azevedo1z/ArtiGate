import { forwardRef, Module } from '@nestjs/common';
import { UserController } from '../interface/controllers/user.controller';
import { PrismaUserRepository } from '../infrastructure/repositories/user.repository';
import { UserRepository } from '../interface/repositories/user.repository.port';
import { CreateUserService } from '../application/services/user/createUser.service';
import { GetUserService } from '../application/services/user/getUser.service';
import { UpdateUserService } from '../application/services/user/updateUser.service';
import { DeleteUserService } from '../application/services/user/deleteUser.service';
import { GetUserRoleService } from '../application/services/userRole/getUserRole.service';
import { AuthService } from '../infrastructure/services/auth.service';
import { AuthGuardService } from '../infrastructure/services/authGuard.service';
import { AddressModule } from './address.module';
import { RoleModule } from './role.module';
import { ReviewModule } from './review.module';
import { ArticleModule } from './article.module';

@Module({
  imports: [
    AddressModule,
    RoleModule,
    forwardRef(() => ReviewModule),
    forwardRef(() => ArticleModule),
  ],
  controllers: [UserController],
  providers: [
    AuthService,
    AuthGuardService,
    CreateUserService,
    GetUserService,
    UpdateUserService,
    DeleteUserService,
    GetUserRoleService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository, GetUserService, AuthService, AuthGuardService],
})
export class UserModule {}
