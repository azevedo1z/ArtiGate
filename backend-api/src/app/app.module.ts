import { Module } from '@nestjs/common';
import { UserController } from './presentations/user.controller';
import { CreateUserService } from './applications/services/user/createUser.service';
import { UserRepositoryImplementation } from './domain/repositories/user.repositoryImplementation';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [CreateUserService, UserRepositoryImplementation],
})
export class AppModule {}
