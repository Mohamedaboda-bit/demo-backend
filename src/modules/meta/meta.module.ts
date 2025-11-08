import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MetaConfigService } from './config/meta.config';
import { MetaCampaignsService } from './services/campaigns.service';
import { MetaAdsetsService } from './services/adsets.service';

@Module({
  imports: [ConfigModule],
  providers: [MetaConfigService, MetaCampaignsService, MetaAdsetsService],
  exports: [MetaCampaignsService, MetaAdsetsService],
})
export class MetaModule {}


