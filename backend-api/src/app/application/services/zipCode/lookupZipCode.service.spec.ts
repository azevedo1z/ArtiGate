import { LookupZipCodeService } from './lookupZipCode.service';
import { ZipCodeLookupAdapter } from '../../../interface/adapter/zipCodeLookup.adapter';
import { ValidationException } from '../../../shared/exceptions/app.exception';

describe('LookupZipCodeService', () => {
  let service: LookupZipCodeService;
  let adapter: jest.Mocked<ZipCodeLookupAdapter>;

  beforeEach(() => {
    adapter = {
      lookup: jest.fn(),
    } as any;

    service = new LookupZipCodeService(adapter);
  });

  it('should return a DTO with the mapped fields on success', async () => {
    adapter.lookup.mockResolvedValue({
      zipCode: '01001000',
      street: 'Praça da Sé',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP',
    });

    const result = await service.execute('01001-000');

    expect(result.zipCode).toBe('01001000');
    expect(result.street).toBe('Praça da Sé');
    expect(result.neighborhood).toBe('Sé');
    expect(result.city).toBe('São Paulo');
    expect(result.state).toBe('SP');
  });

  it('should strip non-digits before delegating to the adapter', async () => {
    adapter.lookup.mockResolvedValue({
      zipCode: '01001000',
      street: '',
      neighborhood: '',
      city: 'São Paulo',
      state: 'SP',
    });

    await service.execute('01001-000');

    expect(adapter.lookup).toHaveBeenCalledWith('01001000');
  });

  it('should throw ValidationException for zip codes shorter than 8 digits', async () => {
    await expect(service.execute('123')).rejects.toBeInstanceOf(
      ValidationException
    );
    expect(adapter.lookup).not.toHaveBeenCalled();
  });

  it('should throw ValidationException for zip codes longer than 8 digits', async () => {
    await expect(service.execute('123456789')).rejects.toBeInstanceOf(
      ValidationException
    );
    expect(adapter.lookup).not.toHaveBeenCalled();
  });

  it('should throw ValidationException when the input has no digits', async () => {
    await expect(service.execute('abc-defg')).rejects.toBeInstanceOf(
      ValidationException
    );
    expect(adapter.lookup).not.toHaveBeenCalled();
  });
});
