import apiClient from './api.service';
import { ZipCodeLookupResult } from '../shared/types/types.shared';

class ZipCodeService {
  async lookup(zipCode: string): Promise<ZipCodeLookupResult> {
    const normalized = zipCode.replace(/\D/g, '');
    const response = await apiClient.get(`/zip-code/${normalized}`);
    return response.data;
  }
}

export const zipCodeService = new ZipCodeService();
