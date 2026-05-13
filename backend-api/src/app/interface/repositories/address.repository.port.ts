import { Address } from '../../domain/models/address.model';
import { CreateAddressDTO } from '../../application/dtos/address/createAddress.dto';
import { UpdateAddressDTO } from '../../application/dtos/address/updateAddress.dto';
import { PaginationDTO } from '../../shared/dtos/pagination.dto';

/**
 * Persistence port for Address aggregates.
 *
 * Convention for all ports under interface/repositories/:
 *  - Methods return Domain entities, not Prisma rows.
 *  - No optional methods; each port declares only what the application uses.
 *  - Concrete implementation lives in infrastructure/repositories/.
 */
export abstract class AddressRepository {
  abstract create(data: CreateAddressDTO): Promise<Address>;
  abstract update(data: UpdateAddressDTO): Promise<Address>;
  abstract findById(id: string): Promise<Address | null>;
  abstract findAll(pagination?: PaginationDTO): Promise<Address[]>;
  abstract delete(id: string): Promise<boolean>;
}
