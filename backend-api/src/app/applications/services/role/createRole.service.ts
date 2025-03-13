import { Injectable } from "@nestjs/common";
import { CreateRoleDTO } from "../../dtos/roles/createRole.dto";
import { Role } from "../../../domain/models/role.model"
import { RoleRepository } from "../../../domain/repositories/role.repository";

@Injectable()
export class CreateRoleService {
  constructor(private readonly repository: RoleRepository) {}

  async execute(data: CreateRoleDTO): Promise<Role> {

    const roleRecord = await this.repository.create(data);

    return Role.factory(roleRecord.id, roleRecord.name);
  }
}