import { User } from "@prisma/client";
import { CreateUserDTO } from "../../applications/dtos/user/createUser.dto";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
}
