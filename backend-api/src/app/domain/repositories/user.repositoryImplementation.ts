import { User } from "../models/user.model";
import { PrismaService } from "../../infrastructure/prisma.service";
import { CreateUserDTO } from "../../applications/dtos/user/createUser.dto";
import { UserRepository } from "./user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepositoryImplementation implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(
    userData: CreateUserDTO,
    homeAddressId: string,
    jobAddressId: string
  ): Promise<User> {

    const data = {
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      badgeUrl: userData.badgeUrl,
      homeAddressId,
      jobAddressId,
    };

    return this.prisma.user.create({ data });
  }
}