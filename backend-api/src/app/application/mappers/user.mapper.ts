import { User as UserRow } from '@prisma/client';
import { User } from '../../domain/models/user.model';

export const userRowToDomain = (row: UserRow): User =>
  User.factory({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    homeAddressId: row.homeAddressId,
    jobAddressId: row.jobAddressId,
    badgeUrl: row.badgeUrl,
    passwordHash: row.passwordHash,
  });
