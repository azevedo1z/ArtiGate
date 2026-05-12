import { Address as AddressRow } from '@prisma/client';
import { Address } from '../../domain/models/address.model';

export const addressRowToDomain = (row: AddressRow): Address =>
  Address.factory({
    id: row.id,
    zipCode: row.zipCode,
    street: row.street,
    neighborhood: row.neighborhood,
    city: row.city,
    state: row.state,
    country: row.country,
    complement: row.complement,
  });
