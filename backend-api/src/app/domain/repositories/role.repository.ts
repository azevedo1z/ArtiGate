import { CreateRoleDTO } from "../../applications/dtos/roles/createRole.dto";
import { Role } from "../models/role.model";

export abstract class RoleRepository {
  abstract findByName(name: string): Promise<Role | null>;
  abstract create(data: CreateRoleDTO): Promise<Role>;
}