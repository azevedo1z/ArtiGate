import { CreateRoleDTO } from '../../application/dtos/role/createRole.dto';
import { Role } from '@prisma/client';

export abstract class RoleRepository {
  abstract findByName(name: string): Promise<Role | null>;
  abstract findById(id: string): Promise<Role | null>;
  abstract create(data: CreateRoleDTO): Promise<Role>;
  abstract findAll(): Promise<Role[]>;
}
