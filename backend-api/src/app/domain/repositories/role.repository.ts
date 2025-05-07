import { CreateRoleDTO } from '../../application/dtos/role/createRole.dto';
import { Role } from '@prisma/client';
import { UpdateRoleDTO } from '../../application/dtos/role/updateRole.dto';

export abstract class RoleRepository {
  abstract findByName(name: string): Promise<Role | null>;
  abstract findById(id: string): Promise<Role | null>;
  abstract create(data: CreateRoleDTO): Promise<Role>;
  abstract update(data: UpdateRoleDTO): Promise<Role>;
  abstract findAll(): Promise<Role[]>;
}
