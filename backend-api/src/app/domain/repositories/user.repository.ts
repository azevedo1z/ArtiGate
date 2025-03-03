import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";
import { CreateUserDTO } from "../../applications/dtos/user/createUser.dto";

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserDTO): Promise<User> {
    return this.prisma.user.create({ data });
  }
}