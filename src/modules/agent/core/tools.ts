import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tool } from 'langchain';
import { z } from 'zod';
import { ShopifyOrdersService } from '../../shopify/services/orders.service';
import { ShopifyCustomersService } from '../../shopify/services/customers.service';
import { MetaCampaignsService } from '../../meta/services/campaigns.service';
import { MetaAdsetsService } from '../../meta/services/adsets.service';

@Injectable()
export class ToolsService {
    private tools: any[] = [];

    constructor(
        private configService: ConfigService,
        private readonly shopifyOrders: ShopifyOrdersService,
        private readonly shopifyCustomers: ShopifyCustomersService,
        private readonly metaCampaigns: MetaCampaignsService,
        private readonly metaAdsets: MetaAdsetsService,
    ) {
        this.initializeTools();
    }

    private initializeTools() {
        // Shopify: Orders
        const getShopifyOrdersTool = tool(
            async ({ startDate, endDate }) => {
                const res = await this.shopifyOrders.getAllOrders(startDate ?? null, endDate ?? null);
                return res;
            },
            {
                name: 'get_shopify_orders',
                description: 'Fetch Shopify orders with optional date range and return full data with analytics.',
                schema: z.object({
                    startDate: z.string().optional().describe('YYYY-MM-DD'),
                    endDate: z.string().optional().describe('YYYY-MM-DD'),
                }),
            }
        );

        // Shopify: Customers
        const getShopifyCustomersTool = tool(
            async ({ startDate, endDate }) => {
                const res = await this.shopifyCustomers.getAllCustomers(startDate ?? null, endDate ?? null);
                return res;
            },
            {
                name: 'get_shopify_customers',
                description: 'Fetch Shopify customers with optional date range and return full data with analytics.',
                schema: z.object({
                    startDate: z.string().optional().describe('YYYY-MM-DD'),
                    endDate: z.string().optional().describe('YYYY-MM-DD'),
                }),
            }
        );

        // Meta: Campaigns
        const getMetaCampaignsTool = tool(
            async ({ startDate, endDate, metric, sortOrder, accountId }) => {
                const res = await this.metaCampaigns.getCampaigns({ startDate, endDate, metric, sortOrder, accountId });
                return res;
            },
            {
                name: 'get_meta_campaigns',
                description: 'Fetch Meta campaigns with optional date range, sorting metric, and return analytics.',
                schema: z.object({
                    startDate: z.string().optional().describe('YYYY-MM-DD'),
                    endDate: z.string().optional().describe('YYYY-MM-DD'),
                    metric: z.string().optional().describe('Metric to sort by: roas|spend'),
                    sortOrder: z.enum(['asc', 'desc']).optional(),
                    accountId: z.string().optional().describe('Meta Ad Account ID like act_123'),
                }),
            }
        );

        // Meta: AdSets
        const getMetaAdsetsTool = tool(
            async ({ startDate, endDate, metric, sortOrder, accountId, campaignId }) => {
                const res = await this.metaAdsets.getAdSets({ startDate, endDate, metric, sortOrder, accountId, campaignId });
                return res;
            },
            {
                name: 'get_meta_adsets',
                description: 'Fetch Meta ad sets with optional date range, campaign filter, sorting, and analytics.',
                schema: z.object({
                    startDate: z.string().optional().describe('YYYY-MM-DD'),
                    endDate: z.string().optional().describe('YYYY-MM-DD'),
                    metric: z.string().optional().describe('Metric to sort by: roas|spend'),
                    sortOrder: z.enum(['asc', 'desc']).optional(),
                    accountId: z.string().optional().describe('Meta Ad Account ID like act_123'),
                    campaignId: z.string().optional().describe('Filter adsets by a campaign ID'),
                }),
            }
        );

        this.tools.push(
            getShopifyOrdersTool,
            getShopifyCustomersTool,
            getMetaCampaignsTool,
            getMetaAdsetsTool,
        );
    }

    getTools(): any[] {
        return this.tools;
    }

}
