export interface UserRoleRecord {
  id: string;
  userId: string;
  roleId: string;
}

export abstract class UserRoleRepository {
  abstract findAll(): Promise<UserRoleRecord[]>;
  abstract findManyByUserId(userId: string): Promise<UserRoleRecord[]>;
  abstract countByField(field: string, value: string): Promise<number>;
}
