function num(v: unknown, fallback: number): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

function str(v: unknown, fallback = ''): string {
  if (v == null) return fallback;
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return fallback;
}

export interface Product {
  id: string;
  product_name: string;
  category: string;
  current_stock: number;
  minimum_stock: number;
  supplier_name: string;
  supplier_email: string;
  forecast_demand: number;
  delivery_time_days: number;
  temperature: number;
  humidity: number;
  expiration_date: string;
  ai_recommendation: string;
}

export function productFromJson(raw: unknown): Product {
  if (raw == null || typeof raw !== 'object') {
    return {
      id: '',
      product_name: 'Inconnu',
      category: '',
      current_stock: 0,
      minimum_stock: 0,
      supplier_name: '',
      supplier_email: '',
      forecast_demand: 1,
      delivery_time_days: 0,
      temperature: 25,
      humidity: 55,
      expiration_date: '',
      ai_recommendation: '',
    };
  }
  const o = raw as Record<string, unknown>;
  const rawId = str(o.id ?? o.product_id ?? o.ID ?? o.Id, '');
  const id =
    rawId !== ''
      ? rawId
      : `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
  return {
    id,
    product_name: str(o.product_name ?? o.name ?? o.produit, 'Inconnu'),
    category: str(o.category ?? o.categorie, ''),
    current_stock: num(o.current_stock ?? o.stock, 0),
    minimum_stock: num(o.minimum_stock ?? o.min_stock, 0),
    supplier_name: str(o.supplier_name ?? o.fournisseur, ''),
    supplier_email: str(o.supplier_email ?? o.email, ''),
    forecast_demand: num(o.forecast_demand ?? o.demande_prevue, 1),
    delivery_time_days: num(o.delivery_time_days ?? o.delai_livraison, 0),
    temperature: num(o.temperature ?? o.temp, 25),
    humidity: num(o.humidity ?? o.humidite, 55),
    expiration_date: str(o.expiration_date ?? o.date_expiration, ''),
    ai_recommendation: str(
      o.ai_recommendation ?? o.recommendation_ia ?? o.ia,
      '',
    ),
  };
}
