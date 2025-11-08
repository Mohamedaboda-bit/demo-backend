import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShopifyConfigService } from './config/shopify.config';
import { ShopifyOrdersService } from './services/orders.service';
import { ShopifyCustomersService } from './services/customers.service';

@Module({
  imports: [ConfigModule],
  providers: [ShopifyConfigService, ShopifyOrdersService, ShopifyCustomersService],
  exports: [ShopifyOrdersService, ShopifyCustomersService],
})
export class ShopifyModule {}


