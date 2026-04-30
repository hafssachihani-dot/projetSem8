import type { Product } from '@/models/product';

export enum RiskLevel {
  OK = 'OK',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export function getDaysBeforeRupture(product: Product): number {
  const demand = Math.max(product.forecast_demand, 1);
  return Math.floor(product.current_stock / demand);
}

export function getRisk(product: Product): RiskLevel {
  const daysBeforeRupture = getDaysBeforeRupture(product);
  const delivery = product.delivery_time_days;
  const stock = product.current_stock;
  const min = product.minimum_stock;

  if (stock <= 0) return RiskLevel.CRITICAL;
  if (stock <= min) return RiskLevel.CRITICAL;
  if (daysBeforeRupture <= delivery) return RiskLevel.CRITICAL;

  if (stock <= min * 1.7) return RiskLevel.WARNING;
  if (daysBeforeRupture <= delivery + 2) return RiskLevel.WARNING;

  return RiskLevel.OK;
}
