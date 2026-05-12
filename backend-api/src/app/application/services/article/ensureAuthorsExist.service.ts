import { Injectable } from '@nestjs/common';
import { UserDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { ValidationException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class EnsureAuthorsExistService {
  constructor(private readonly userAdapter: UserDatabaseAdapter) {}

  async execute(authorIds: string[] | undefined): Promise<void> {
    if (!authorIds?.length) return;

    const uniqueIds = [...new Set(authorIds)];
    const users = (await this.userAdapter.findByIds?.(uniqueIds)) ?? [];

    if (users.length === uniqueIds.length) return;

    const foundIds = new Set(users.map((u) => u.id));
    const missingIds = uniqueIds.filter((id) => !foundIds.has(id));

    throw new ValidationException(
      `The authors ${missingIds.join(', ')} are not registered in the system.`
    );
  }
}
