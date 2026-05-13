import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from '../../dtos/user/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../../../shared/constants';
import { CreateAddressDTO } from '../../dtos/address/createAddress.dto';
import { User } from '../../../domain/models/user.model';
import { Address } from '../../../domain/models/address.model';
import { Password } from '../../../domain/values/password.value';
import { UserRepository } from '../../../interface/repositories/user.repository.port';
import { AddressRepository } from '../../../interface/repositories/address.repository.port';
import { RoleRepository } from '../../../interface/repositories/role.repository.port';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class UpdateUserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly addressRepo: AddressRepository,
    private readonly roleRepo: RoleRepository
  ) {}

  async execute(data: UpdateUserDTO): Promise<User> {
    const existing = await this.repo.findById(data.id);
    if (!existing)
      throw new NotFoundException(`User with ID "${data.id}" not found`);

    User.ensureInvariants({
      id: existing.id,
      name: data.name ?? existing.name,
      email: data.email ?? existing.email,
      phone: data.phone ?? existing.phone,
      badgeUrl: data.badgeUrl ?? existing.badgeUrl,
      homeAddressId: existing.homeAddressId,
      jobAddressId: existing.jobAddressId,
      passwordHash: existing.passwordHash,
    });

    let passwordHash: string | undefined;
    if (data.password) {
      const password = Password.fromPlaintext(data.password);
      passwordHash = await bcrypt.hash(password.value, BCRYPT_SALT_ROUNDS);
    }

    const homeAddressId = await this.handleNewAddressCreation(data.homeAddress);
    const jobAddressId = await this.handleNewAddressCreation(data.jobAddress);
    const roleIds = await this.validateRoles(data.roleIds);

    return this.repo.update({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      badgeUrl: data.badgeUrl,
      passwordHash,
      homeAddressId,
      jobAddressId,
      roleIds,
    });
  }

  private async validateRoles(
    roleIds: string[] | undefined
  ): Promise<string[] | undefined> {
    if (!roleIds?.length) return undefined;

    const roles = await this.roleRepo.findByIds(roleIds);
    if (roles.length !== roleIds.length) {
      const foundIds = new Set(roles.map((r) => r.id));
      const missing = roleIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(`Role(s) not found: ${missing.join(', ')}`);
    }
    return roleIds;
  }

  private async handleNewAddressCreation(
    address: CreateAddressDTO
  ): Promise<string | undefined> {
    if (!address) return;

    Address.ensureInvariants({ id: '', ...address });

    const newAddress = await this.addressRepo.create(address);
    return newAddress.id;
  }
}
