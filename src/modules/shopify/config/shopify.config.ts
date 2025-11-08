import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import '@shopify/shopify-api/adapters/node';

@Injectable()
export class ShopifyConfigService {
  private shopify: ReturnType<typeof shopifyApi>;

  constructor(private readonly configService: ConfigService) {
    this.shopify = shopifyApi({
      apiKey: this.configService.get<string>('SHOPIFY_API_KEY') || 'dummy',
      apiSecretKey: this.configService.get<string>('SHOPIFY_API_SECRET') || 'dummy',
      scopes: (this.configService.get<string>('SHOPIFY_SCOPES') || 'read_orders,read_customers').split(','),
      hostName: (this.configService.get<string>('SHOPIFY_APP_URL') || 'localhost').replace(/^https?:\/\//, ''),
      hostScheme: 'https',
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: false,
    });
  }

  getGraphqlClient() {
    const shopDomain = this.configService.get<string>('SHOPIFY_SHOP_DOMAIN');
    const accessToken = this.configService.get<string>('SHOPIFY_ACCESS_TOKEN');
    if (!shopDomain || !accessToken) {
      throw new Error('SHOPIFY_SHOP_DOMAIN and SHOPIFY_ACCESS_TOKEN must be configured');
    }
    const session: any = {
      id: `offline_${shopDomain}`,
      shop: shopDomain,
      state: 'offline',
      isOnline: false,
      isActive: true,
      scope: this.configService.get<string>('SHOPIFY_SCOPES') || '',
      accessToken,
    };
    return new (this.shopify.clients as any).Graphql({ session: session as any });
  }
}


