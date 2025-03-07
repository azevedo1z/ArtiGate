import { Module } from '@nestjs/common';
import { UserController } from './presentations/user.controller';
import { CreateUserService } from './applications/services/user/createUser.service';
import { UserRepositoryImplementation } from './domain/repositories/user.repositoryImplementation';
import { PrismaService } from './infrastructure/prisma.service';
import { UserRepository } from './domain/repositories/user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [CreateUserService,
    {
      provide: UserRepository,
      useClass: UserRepositoryImplementation
     },
     PrismaService],
})
export class AppModule {}
