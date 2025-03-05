import { Controller } from '@nestjs/common';
import { CreateUserService } from '../applications/services/user/createUser.service';

@Controller('user')
export class UserController{
constructor(private readonly createUserService: CreateUserService){}



}