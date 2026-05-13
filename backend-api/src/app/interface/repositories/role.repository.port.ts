import { Role } from '../../domain/models/role.model';
import { CreateRoleDTO } from '../../application/dtos/role/createRole.dto';
import { UpdateRoleDTO } from '../../application/dtos/role/updateRole.dto';

export abstract class RoleRepository {
  abstract create(data: CreateRoleDTO): Promise<Role>;
  abstract update(data: UpdateRoleDTO): Promise<Role>;
  abstract delete(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<Role | null>;
  abstract findAll(): Promise<Role[]>;
  abstract findByIds(ids: string[]): Promise<Role[]>;
  abstract findByName(name: string): Promise<Role | null>;
}
