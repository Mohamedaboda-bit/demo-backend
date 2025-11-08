export type SortOrder = 'asc' | 'desc';

export interface RoasSortOptions {
  spendKey?: string;
  convValueKey?: string;
  roasKey?: string;
  metric?: string | null; // 'roas' | 'spend'
  sortOrder?: SortOrder;
}

export function sortByRoaSAndSpend<T extends Record<string, any>>(
  data: T[],
  options: RoasSortOptions = {}
) {
  const {
    spendKey = 'spend',
    convValueKey = 'conv',
    roasKey = 'roas',
    metric,
    sortOrder = 'desc',
  } = options;

  const metricNormalized = (metric || 'roas').toString().toLowerCase();
  const spendKeyNormalized = String(spendKey).toLowerCase();
  const roasKeyNormalized = String(roasKey).toLowerCase();
  const isSpendMetric =
    metricNormalized.includes('spend') ||
    metricNormalized === 'amount_spent' ||
    metricNormalized === spendKeyNormalized ||
    metricNormalized.includes(spendKeyNormalized);
  const isRoasMetric =
    metricNormalized.includes('roas') ||
    metricNormalized === roasKeyNormalized ||
    metricNormalized.includes(roasKeyNormalized);

  const getRoas = (item: T) => {
    if (roasKey in item && item[roasKey] !== undefined && item[roasKey] !== null) {
      const v = parseFloat(String(item[roasKey]));
      if (!Number.isNaN(v)) return v;
    }
    const spend = parseFloat(String(item[spendKey])) || 0;
    const convValue = parseFloat(String(item[convValueKey])) || 0;
    return spend > 0 ? (convValue / spend) * 100 : 0;
  };

  const getSpend = (item: T) => parseFloat(String(item[spendKey])) || 0;
  const orderMultiplier = sortOrder === 'desc' ? 1 : -1;

  const sorter = (a: T, b: T) => {
    const roasA = getRoas(a);
    const roasB = getRoas(b);
    const spendA = getSpend(a);
    const spendB = getSpend(b);
    if (isSpendMetric) {
      if (spendA !== spendB) return (spendB - spendA) * orderMultiplier;
      return 0;
    }
    if (isRoasMetric) {
      if (roasA !== roasB) return (roasB - roasA) * orderMultiplier;
      return 0;
    }
    if (roasA !== roasB) return (roasB - roasA) * orderMultiplier;
    return 0;
  };

  if (Array.isArray(data) && data.length > 1) data.sort(sorter);
  return data;
}


