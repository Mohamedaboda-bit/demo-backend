import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class MetaConfigService {
  private client: AxiosInstance;
  private version: string;
  private accessToken: string;
  private adAccountId: string;

  constructor(private readonly configService: ConfigService) {
    this.version = this.configService.get<string>('META_API_VERSION') || 'v18.0';
    this.accessToken = this.configService.get<string>('META_ACCESS_TOKEN') || '';
    this.adAccountId = (this.configService.get<string>('META_AD_ACCOUNT_ID') || '').replace(/^act_/, 'act_');
    this.client = axios.create({
      baseURL: `https://graph.facebook.com/${this.version}`,
      timeout: 60000,
    });

    // Logging interceptors (sanitize tokens)
    this.client.interceptors.request.use((config) => {
      const params = { ...(config.params || {}) } as Record<string, any>;
      if (params.access_token) params.access_token = '[REDACTED]';
      Logger.debug(
        `[Meta][Request] ${config.method?.toUpperCase()} ${config.url} params=${JSON.stringify(params)}`,
        MetaConfigService.name
      );
      return config;
    });

    this.client.interceptors.response.use(
      (res) => {
        const url = res.config?.url || '';
        Logger.debug(
          `[Meta][Response] ${res.status} ${url} length=${Array.isArray(res.data?.data) ? res.data.data.length : 'n/a'}`,
          MetaConfigService.name
        );
        return res;
      },
      (error) => {
        const status = error.response?.status;
        const url = error.config?.url;
        const payload = error.response?.data;
        Logger.error(
          `[Meta][Error] ${status || 'n/a'} ${url || ''} data=${JSON.stringify(payload)}`,
          undefined,
          MetaConfigService.name
        );
        return Promise.reject(error);
      }
    );
  }

  getAccessToken() {
    if (!this.accessToken) throw new Error('META_ACCESS_TOKEN must be configured');
    return this.accessToken;
  }

  getAdAccountId() {
    if (!this.adAccountId) throw new Error('META_AD_ACCOUNT_ID must be configured');
    return this.adAccountId;
  }

  getClient() {
    return this.client;
  }
}


