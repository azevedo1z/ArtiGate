import { Role as RoleRow } from '@prisma/client';
import { Role } from '../../domain/models/role.model';

export const roleRowToDomain = (row: RoleRow): Role =>
  Role.factory({
    id: row.id,
    name: row.name,
  });
