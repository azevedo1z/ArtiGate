export interface ZipCodeLookupData {
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export abstract class ZipCodeLookupAdapter {
  abstract lookup(zipCode: string): Promise<ZipCodeLookupData>;
}
