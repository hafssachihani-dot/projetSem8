export type PurchaseStatus = 'pending' | 'sent' | 'delivered' | 'cancelled';

function str(v: unknown, fallback = ''): string {
  if (v == null) return fallback;
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return fallback;
}

function num(v: unknown, fallback: number): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

export interface Purchase {
  id: string;
  product_id: string;
  product_name: string;
  quantity_ordered: number;
  supplier_name: string;
  supplier_email: string;
  status: PurchaseStatus;
  message: string;
  created_at: string;
}

function normalizeStatus(raw: unknown): PurchaseStatus {
  const s = str(raw, 'pending').toLowerCase();
  if (s === 'delivered' || s === 'livre' || s === 'livré') return 'delivered';
  if (s === 'cancelled' || s === 'annule' || s === 'annulé') return 'cancelled';
  if (s === 'sent' || s === 'envoye' || s === 'envoyé') return 'sent';
  return 'pending';
}

export function purchaseFromJson(raw: unknown): Purchase {
  if (raw == null || typeof raw !== 'object') {
    return {
      id: String(Date.now()),
      product_id: '',
      product_name: '',
      quantity_ordered: 0,
      supplier_name: '',
      supplier_email: '',
      status: 'pending',
      message: '',
      created_at: new Date().toISOString(),
    };
  }
  const o = raw as Record<string, unknown>;
  return {
    id: str(o.id ?? o.purchase_id ?? o.ID, String(Date.now())),
    product_id: str(o.product_id ?? o.productId, ''),
    product_name: str(o.product_name ?? o.produit, ''),
    quantity_ordered: num(o.quantity_ordered ?? o.quantity ?? o.qte, 0),
    supplier_name: str(o.supplier_name, ''),
    supplier_email: str(o.supplier_email, ''),
    status: normalizeStatus(o.status ?? o.statut),
    message: str(o.message ?? o.msg, ''),
    created_at: str(
      o.created_at ?? o.date ?? o.createdAt,
      new Date().toISOString(),
    ),
  };
}
