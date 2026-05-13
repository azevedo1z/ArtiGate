import { CreateUserDTO } from '../../dtos/user/createUser.dto';
import { User } from '../../../domain/models/user.model';
import { Address } from '../../../domain/models/address.model';
import { Password } from '../../../domain/values/password.value';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../../../shared/constants';
import { UserRepository } from '../../../interface/repositories/user.repository.port';
import { AddressRepository } from '../../../interface/repositories/address.repository.port';
import { RoleRepository } from '../../../interface/repositories/role.repository.port';
import {
  ConflictException,
  NotFoundException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly addressRepo: AddressRepository,
    private readonly roleRepo: RoleRepository
  ) {}

  async execute(data: CreateUserDTO): Promise<User> {
    const existingUser = await this.repo.findByEmail(data.email);
    if (existingUser)
      throw new ConflictException('There is already a user with this e-mail.');

    await this.validateRoles(data.roleIds);

    Address.ensureInvariants({ id: '', ...data.homeAddress });
    Address.ensureInvariants({ id: '', ...data.jobAddress });

    const password = Password.fromPlaintext(data.password);

    User.ensureInvariants({
      id: '',
      name: data.name,
      email: data.email,
      phone: data.phone,
      badgeUrl: data.badgeUrl,
      homeAddressId: '',
      jobAddressId: '',
      passwordHash: data.password,
    });

    const passwordHash = await bcrypt.hash(password.value, BCRYPT_SALT_ROUNDS);

    const homeAddress = await this.addressRepo.create(data.homeAddress);
    const jobAddress = await this.addressRepo.create(data.jobAddress);

    return this.repo.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      badgeUrl: data.badgeUrl,
      passwordHash,
      homeAddressId: homeAddress.id,
      jobAddressId: jobAddress.id,
      roleIds: data.roleIds,
    });
  }

  private async validateRoles(roleIds: string[]): Promise<void> {
    const roles = await this.roleRepo.findByIds(roleIds);
    if (roles.length !== roleIds.length) {
      const foundIds = new Set(roles.map((r) => r.id));
      const missing = roleIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(`Role(s) not found: ${missing.join(', ')}`);
    }
  }
}
