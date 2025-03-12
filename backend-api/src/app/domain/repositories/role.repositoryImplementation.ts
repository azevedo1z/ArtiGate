import { Injectable } from "@nestjs/common";
import { CreateRoleDTO } from "../../applications/dtos/roles/createRole.dto";
import { Role } from "../models/role.model";
import { RoleRepository } from "./role.repository";
import { PrismaService } from "../../infrastructure/prisma.service";

@Injectable()
export class RoleRepositoryImplementation implements RoleRepository{
    constructor(private readonly prisma: PrismaService){}

    async findByName(name: string): Promise<Role | null> {

        return this.prisma.role.findUnique({
          where: { name },
        });
    }
    
    async create(data: CreateRoleDTO): Promise<Role> {

        return this.prisma.role.create({ data });
    }

}