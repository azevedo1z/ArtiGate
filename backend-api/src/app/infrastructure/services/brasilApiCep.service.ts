import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import {
  ZipCodeLookupAdapter,
  ZipCodeLookupData,
} from '../../interface/adapter/zipCodeLookup.adapter';
import {
  AppException,
  NotFoundException,
} from '../../shared/exceptions/app.exception';

interface BrasilApiCepResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string | null;
  street: string | null;
}

@Injectable()
export class BrasilApiCepService extends ZipCodeLookupAdapter {
  private readonly logger = new Logger(BrasilApiCepService.name);
  private readonly baseUrl: string;
  private readonly requestTimeoutMs = 5000;

  constructor(private readonly configService: ConfigService) {
    super();
    this.baseUrl =
      this.configService.get<string>('brasilApi.baseUrl') ??
      'https://brasilapi.com.br';
  }

  async lookup(zipCode: string): Promise<ZipCodeLookupData> {
    const normalized = zipCode.replace(/\D/g, '');
    const url = `${this.baseUrl}/api/cep/v2/${normalized}`;

    try {
      const { data } = await axios.get<BrasilApiCepResponse>(url, {
        timeout: this.requestTimeoutMs,
      });

      return {
        zipCode: data.cep,
        street: data.street ?? '',
        neighborhood: data.neighborhood ?? '',
        city: data.city,
        state: data.state,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;

        if (status === 404 || status === 400)
          throw new NotFoundException(`Brazilian zip code "${zipCode}" not found.`);

        this.logger.error(
          `BrasilAPI CEP lookup failed for "${zipCode}": ${error.message}`,
          error.stack
        );
      }

      throw new AppException('Failed to look up Brazilian zip code. Please try again.');
    }
  }
}
