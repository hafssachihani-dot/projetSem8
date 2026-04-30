export type NotificationKind = 'alert' | 'tendance';

export interface SmartNotification {
  _id: string;
  product_id: string;
  product_name: string;
  reason: string;
  recommended_order_quantity?: number;
  kind: NotificationKind;
}

export function notificationFromUnknown(
  raw: unknown,
  kind: NotificationKind,
): SmartNotification | null {
  if (raw == null || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const pid = o.product_id ?? o.id ?? o.productId;
  const product_id =
    pid != null && pid !== '' ? String(pid) : '';
  if (!product_id) return null;
  const baseId = kind === 'alert' ? `alert_${product_id}` : `tendance_${product_id}`;
  return {
    _id: str(o._id, baseId),
    product_id,
    product_name: str(o.product_name ?? o.name ?? o.produit, 'Produit'),
    reason: str(o.reason ?? o.message ?? o.raison, ''),
    recommended_order_quantity:
      typeof o.recommended_order_quantity === 'number'
        ? o.recommended_order_quantity
        : typeof o.recommended_order_quantity === 'string'
          ? Number(o.recommended_order_quantity) || undefined
          : typeof o.quantity === 'number'
            ? o.quantity
            : undefined,
    kind,
  };
}

function str(v: unknown, fallback = ''): string {
  if (v == null) return fallback;
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return fallback;
}
