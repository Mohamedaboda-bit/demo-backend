import { Injectable, Logger } from '@nestjs/common';
import { MetaConfigService } from '../config/meta.config';
import { MetaAdSet, MetaGenericResponse } from '../interfaces/meta.interfaces';
import { sortByRoaSAndSpend } from '../utils/analytics.helper';

@Injectable()
export class MetaAdsetsService {
  constructor(private readonly metaConfig: MetaConfigService) {}

  private parseConvValue(actionsValues: any[]): number {
    if (!Array.isArray(actionsValues)) return 0;
    let total = 0;
    for (const item of actionsValues) {
      const actionType = String(item.action_type || '').toLowerCase();
      if (actionType.includes('purchase')) {
        total += parseFloat(String(item.value || 0)) || 0;
      }
    }
    return total;
  }

  async getAdSets(params: {
    startDate?: string | null;
    endDate?: string | null;
    metric?: string | null; // 'roas' | 'spend'
    sortOrder?: 'asc' | 'desc';
    accountId?: string | null;
    campaignId?: string | null;
  } = {}): Promise<MetaGenericResponse<MetaAdSet>> {
    const { startDate, endDate, metric, sortOrder = 'desc', campaignId } = params;
    const accountId = (params.accountId || this.metaConfig.getAdAccountId()).replace(/^act_/, 'act_');

    const client = this.metaConfig.getClient();
    const access_token = this.metaConfig.getAccessToken();
    const time_range = startDate && endDate ? { since: startDate, until: endDate } : undefined;

    const filtering = campaignId
      ? JSON.stringify([
          { field: 'campaign.id', operator: 'EQUAL', value: campaignId },
        ])
      : undefined;

    Logger.log(
      `[Meta][AdSets] Fetching insights accountId=${accountId} range=${JSON.stringify(time_range)} campaignId=${campaignId || '-'} metric=${metric || 'roas'} sort=${sortOrder}`,
      MetaAdsetsService.name
    );

    let response;
    try {
      response = await client.get(`/${accountId}/insights`, {
        params: {
          access_token,
          level: 'adset',
          time_range: time_range ? JSON.stringify(time_range) : undefined,
          time_increment: 1,
          filtering,
          fields: [
            'adset_id',
            'adset_name',
            'campaign_id',
            'spend',
            'impressions',
            'clicks',
            'actions',
            'action_values',
            'purchase_roas',
          ].join(','),
        },
      });
    } catch (err: any) {
      Logger.error(`[Meta][AdSets] Request failed: ${err?.message}`, err?.stack, MetaAdsetsService.name);
      throw err;
    }

    const rows: any[] = response.data?.data || [];
    const data = rows.map((r) => {
      const spend = parseFloat(String(r.spend || 0)) || 0;
      let convValue = 0;
      if (Array.isArray(r.action_values)) convValue = this.parseConvValue(r.action_values);
      if (!convValue && Array.isArray(r.purchase_roas) && r.purchase_roas[0]?.value) {
        const roas = parseFloat(String(r.purchase_roas[0].value)) || 0;
        if (spend > 0) convValue = roas * spend;
      }
      const roas = spend > 0 ? (convValue / spend) * 100 : 0;
      const obj: MetaAdSet = {
        id: String(r.adset_id),
        name: r.adset_name,
        campaign_id: r.campaign_id,
        metrics: {
          spend,
          impressions: parseFloat(String(r.impressions || 0)) || 0,
          clicks: parseFloat(String(r.clicks || 0)) || 0,
          convValue,
          roas,
        },
      };
      return obj;
    });

    const sorted = sortByRoaSAndSpend(data.map((d) => ({
      ...d,
      spend: d.metrics?.spend ?? 0,
      conv: d.metrics?.convValue ?? 0,
      roas: d.metrics?.roas ?? 0,
    })), { metric: metric || 'roas', sortOrder });

    const final = sorted.map((s: any) => {
      const { spend, conv, roas, ...rest } = s;
      return rest as MetaAdSet;
    });

    const totalSpend = data.reduce((sum, d) => sum + (d.metrics?.spend || 0), 0);
    const totalConv = data.reduce((sum, d) => sum + (d.metrics?.convValue || 0), 0);
    const averageROAS = totalSpend > 0 ? (totalConv / totalSpend) * 100 : 0;

    const tableData = final.map((a) => [
      a.id,
      a.name,
      a.campaign_id || '-',
      a.metrics?.spend ?? 0,
      a.metrics?.impressions ?? 0,
      a.metrics?.clicks ?? 0,
      a.metrics?.convValue ?? 0,
      (a.metrics?.roas ?? 0).toFixed(2),
    ]);

    return {
      displayed: {
        type: 'table',
        header: ['AdSet ID', 'AdSet Name', 'Campaign ID', 'Spend', 'Impressions', 'Clicks', 'Conv Value', 'ROAS%'],
        data: tableData,
      },
      data: final,
      analytics: {
        totalSpend: Number(totalSpend.toFixed(2)),
        totalConvValue: Number(totalConv.toFixed(2)),
        averageROAS: Number(averageROAS.toFixed(2)),
      },
    };
  }
}


