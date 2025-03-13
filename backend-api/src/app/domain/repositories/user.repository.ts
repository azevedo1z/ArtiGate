import { User } from "@prisma/client";
import { CreateUserDTO } from "../../applications/dtos/user/createUser.dto";

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(
    data: CreateUserDTO,
    homeAddressId: string,
    jobAddressId: string
  ): Promise<User>;
}
