export interface DisplayTable {
  type: 'table';
  header: string[];
  data: (string | number)[][];
}

export interface MetaPerformanceMetrics {
  spend?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  convValue?: number; // purchase value
  roas?: number; // convValue / spend * 100 or other normalization
}

export interface MetaCampaign {
  id: string;
  name: string;
  status?: string;
  objective?: string;
  start_time?: string;
  stop_time?: string;
  metrics?: MetaPerformanceMetrics;
}

export interface MetaAdSet {
  id: string;
  name: string;
  campaign_id?: string;
  status?: string;
  metrics?: MetaPerformanceMetrics;
}

export interface MetaGenericResponse<TData = any> {
  displayed: DisplayTable;
  data: TData[];
  analytics?: {
    // optional aggregate analytics
    totalSpend?: number;
    totalConvValue?: number;
    averageROAS?: number;
  };
}


