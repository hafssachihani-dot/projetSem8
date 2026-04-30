import { productFromJson, type Product } from '@/models/product';
import {
  purchaseFromJson,
  type Purchase,
  type PurchaseStatus,
} from '@/models/purchase';

export const delay = (ms: number) =>
  new Promise<void>((r) => setTimeout(r, ms));

export function normalizeArray<T>(value: unknown): T[] {
  if (value == null) return [];
  if (typeof value === 'string') {
    const s = value.trim();
    if (s.startsWith('{{')) return [];
    try {
      const parsed: unknown = JSON.parse(s);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(value)) return value as T[];
  return [];
}

type MockProduct = {
  id: number;
  product_name: string;
  category: string;
  current_stock: number;
  minimum_stock: number;
  supplier_name: string;
  supplier_email: string;
  temperature: number;
  humidity: number;
  forecast_demand: number;
  delivery_time_days: number;
};

const INITIAL_PRODUCTS: MockProduct[] = [
  {
    id: 1,
    product_name: 'Monitor',
    category: 'IT',
    current_stock: 15,
    minimum_stock: 20,
    supplier_name: 'ScreenTech',
    supplier_email: 'screen@mail.com',
    temperature: 25,
    humidity: 50,
    forecast_demand: 1,
    delivery_time_days: 3,
  },
  {
    id: 2,
    product_name: 'Keyboard',
    category: 'IT',
    current_stock: 20,
    minimum_stock: 20,
    supplier_name: 'KeyCorp',
    supplier_email: 'key@mail.com',
    temperature: 25,
    humidity: 50,
    forecast_demand: 1,
    delivery_time_days: 3,
  },
  {
    id: 3,
    product_name: 'Paper A4',
    category: 'Office',
    current_stock: 30,
    minimum_stock: 20,
    supplier_name: 'PaperInc',
    supplier_email: 'paper@mail.com',
    temperature: 25,
    humidity: 50,
    forecast_demand: 1,
    delivery_time_days: 3,
  },
  {
    id: 4,
    product_name: 'USB Cable',
    category: 'IT',
    current_stock: 50,
    minimum_stock: 20,
    supplier_name: 'maissae',
    supplier_email: 'maissae@gmail.com',
    temperature: 25,
    humidity: 55,
    forecast_demand: 1,
    delivery_time_days: 3,
  },
  {
    id: 5,
    product_name: 'Desk Chair',
    category: 'Mobilier',
    current_stock: 8,
    minimum_stock: 10,
    supplier_name: 'FurniPro',
    supplier_email: 'furni@mail.com',
    temperature: 22,
    humidity: 45,
    forecast_demand: 1,
    delivery_time_days: 5,
  },
  {
    id: 6,
    product_name: 'Laptop Stand',
    category: 'IT',
    current_stock: 35,
    minimum_stock: 15,
    supplier_name: 'TechGear',
    supplier_email: 'tech@mail.com',
    temperature: 25,
    humidity: 50,
    forecast_demand: 1,
    delivery_time_days: 2,
  },
  {
    id: 7,
    product_name: 'Whiteboard',
    category: 'Office',
    current_stock: 5,
    minimum_stock: 8,
    supplier_name: 'OfficeMax',
    supplier_email: 'office@mail.com',
    temperature: 20,
    humidity: 40,
    forecast_demand: 1,
    delivery_time_days: 4,
  },
  {
    id: 8,
    product_name: 'Printer Ink',
    category: 'Office',
    current_stock: 12,
    minimum_stock: 25,
    supplier_name: 'InkWorld',
    supplier_email: 'ink@mail.com',
    temperature: 18,
    humidity: 35,
    forecast_demand: 2,
    delivery_time_days: 3,
  },
  {
    id: 9,
    product_name: 'Ethernet Cable',
    category: 'IT',
    current_stock: 60,
    minimum_stock: 20,
    supplier_name: 'NetSupply',
    supplier_email: 'net@mail.com',
    temperature: 25,
    humidity: 50,
    forecast_demand: 1,
    delivery_time_days: 2,
  },
  {
    id: 10,
    product_name: 'Stapler',
    category: 'Office',
    current_stock: 22,
    minimum_stock: 10,
    supplier_name: 'StaplesCo',
    supplier_email: 'staples@mail.com',
    temperature: 25,
    humidity: 50,
    forecast_demand: 1,
    delivery_time_days: 1,
  },
];

type MockPurchaseRow = {
  id: number;
  product_name: string;
  product_id: number;
  supplier_name: string;
  supplier_email: string;
  quantity_ordered: number;
  status: PurchaseStatus;
  message: string;
  created_at: string;
};

const INITIAL_PURCHASES: MockPurchaseRow[] = [
  {
    id: 1,
    product_name: 'Monitor',
    product_id: 1,
    supplier_name: 'ScreenTech',
    supplier_email: 'screen@mail.com',
    quantity_ordered: 50,
    status: 'pending',
    message: 'Commande urgente',
    created_at: '2026-04-28T10:00:00Z',
  },
  {
    id: 2,
    product_name: 'Printer Ink',
    product_id: 8,
    supplier_name: 'InkWorld',
    supplier_email: 'ink@mail.com',
    quantity_ordered: 100,
    status: 'sent',
    message: 'Réapprovisionnement',
    created_at: '2026-04-27T09:00:00Z',
  },
  {
    id: 3,
    product_name: 'Desk Chair',
    product_id: 5,
    supplier_name: 'FurniPro',
    supplier_email: 'furni@mail.com',
    quantity_ordered: 20,
    status: 'delivered',
    message: '',
    created_at: '2026-04-25T14:00:00Z',
  },
  {
    id: 4,
    product_name: 'Whiteboard',
    product_id: 7,
    supplier_name: 'OfficeMax',
    supplier_email: 'office@mail.com',
    quantity_ordered: 15,
    status: 'pending',
    message: 'Stock critique',
    created_at: '2026-04-29T08:00:00Z',
  },
  {
    id: 5,
    product_name: 'Keyboard',
    product_id: 2,
    supplier_name: 'KeyCorp',
    supplier_email: 'key@mail.com',
    quantity_ordered: 30,
    status: 'cancelled',
    message: 'Annulé - changement fournisseur',
    created_at: '2026-04-26T11:00:00Z',
  },
];

type MockAlert = {
  product_id: number;
  product_name: string;
  reason: string;
  recommended_order_quantity: number;
  supplier_name: string;
  supplier_email: string;
};

type MockTendance = {
  product_id: number;
  product_name: string;
  reason: string;
};

let mockProducts: MockProduct[] = INITIAL_PRODUCTS.map((p) => ({ ...p }));
let mockPurchases: MockPurchaseRow[] = INITIAL_PURCHASES.map((p) => ({ ...p }));
let mockAlerts: MockAlert[] = [
  {
    product_id: 1,
    product_name: 'Monitor',
    reason: 'Stock sous le minimum (15 < 20)',
    recommended_order_quantity: 50,
    supplier_name: 'ScreenTech',
    supplier_email: 'screen@mail.com',
  },
  {
    product_id: 7,
    product_name: 'Whiteboard',
    reason: 'Stock critique (5 < 8)',
    recommended_order_quantity: 30,
    supplier_name: 'OfficeMax',
    supplier_email: 'office@mail.com',
  },
  {
    product_id: 8,
    product_name: 'Printer Ink',
    reason: 'Rupture prévue dans 6 jours',
    recommended_order_quantity: 100,
    supplier_name: 'InkWorld',
    supplier_email: 'ink@mail.com',
  },
];
let mockTendances: MockTendance[] = [
  {
    product_id: 4,
    product_name: 'USB Cable',
    reason: 'Forte demande détectée ce mois',
  },
  {
    product_id: 9,
    product_name: 'Ethernet Cable',
    reason: 'Tendance hausse +30% prévue',
  },
];

function nextProductId(): number {
  return Math.max(...mockProducts.map((p) => p.id), 0) + 1;
}

function nextPurchaseId(): number {
  return Math.max(...mockPurchases.map((p) => p.id), 0) + 1;
}

function randomNonZeroDelta(): number {
  const sign = Math.random() < 0.5 ? -1 : 1;
  const mag = 1 + Math.floor(Math.random() * 5);
  return sign * mag;
}

export function applyRandomStockSimulation(): void {
  const count = Math.random() < 0.5 ? 1 : 2;
  const indices = new Set<number>();
  while (indices.size < count && indices.size < mockProducts.length) {
    indices.add(Math.floor(Math.random() * mockProducts.length));
  }
  indices.forEach((i) => {
    const p = mockProducts[i];
    if (!p) return;
    let delta = randomNonZeroDelta();
    if (p.current_stock + delta < 0) {
      delta = -p.current_stock;
    }
    mockProducts[i] = {
      ...p,
      current_stock: Math.max(0, p.current_stock + delta),
    };
  });
}

export interface DashboardPayload {
  products: Product[];
  purchases: Purchase[];
  notificationsJson: unknown[];
  tendanceJson: unknown[];
}

export async function fetchDashboard(): Promise<DashboardPayload> {
  await delay(800);
  const products = mockProducts.map((p) =>
    productFromJson({ ...p, id: p.id }),
  );
  const purchases = mockPurchases.map((p) =>
    purchaseFromJson({
      ...p,
      id: p.id,
      product_id: String(p.product_id),
    }),
  );
  const notificationsJson = mockAlerts.map((a) => ({ ...a })) as unknown[];
  const tendanceJson = mockTendances.map((t) => ({ ...t })) as unknown[];
  return {
    products,
    purchases,
    notificationsJson,
    tendanceJson,
  };
}

export interface AddProductInput {
  product_name: string;
  category: string;
  current_stock: number;
  minimum_stock: number;
  supplier_name: string;
  supplier_email: string;
  expiration_date: string;
  temperature: number;
  humidity: number;
}

export async function addProductApi(data: AddProductInput): Promise<void> {
  await delay(600);
  const id = nextProductId();
  mockProducts.push({
    id,
    product_name: data.product_name,
    category: data.category,
    current_stock: data.current_stock,
    minimum_stock: data.minimum_stock,
    supplier_name: data.supplier_name,
    supplier_email: data.supplier_email,
    temperature: data.temperature,
    humidity: data.humidity,
    forecast_demand: 1,
    delivery_time_days: 3,
  });
}

export interface CreatePurchaseInput {
  product_id: string;
  product_name: string;
  quantity_ordered: number;
  supplier_name: string;
  supplier_email: string;
  status: string;
  message: string;
}

export async function createPurchaseApi(
  data: CreatePurchaseInput,
): Promise<void> {
  await delay(600);
  const pid = Number(data.product_id);
  mockPurchases.push({
    id: nextPurchaseId(),
    product_name: data.product_name,
    product_id: Number.isFinite(pid) ? pid : nextProductId(),
    supplier_name: data.supplier_name,
    supplier_email: data.supplier_email,
    quantity_ordered: data.quantity_ordered,
    status: (data.status as PurchaseStatus) ?? 'pending',
    message: data.message,
    created_at: new Date().toISOString(),
  });
}

export interface StockMovementInput {
  product_name: string;
  quantity: number;
  reason: string;
  type: 'IN' | 'OUT';
}

export async function stockMovementApi(
  data: StockMovementInput,
): Promise<void> {
  await delay(500);
  const idx = mockProducts.findIndex(
    (p) => p.product_name === data.product_name,
  );
  if (idx < 0) return;
  const p = mockProducts[idx];
  const delta = data.type === 'IN' ? data.quantity : -data.quantity;
  mockProducts[idx] = {
    ...p,
    current_stock: Math.max(0, p.current_stock + delta),
  };
}

export async function setPurchaseStatusApi(
  id: string,
  status: PurchaseStatus,
): Promise<void> {
  await delay(400);
  const numId = Number(id);
  mockPurchases = mockPurchases.map((row) =>
    row.id === numId ? { ...row, status } : row,
  );
}

export function removeMockNotificationById(_id: string): void {
  if (_id.startsWith('alert_')) {
    const pid = _id.replace('alert_', '');
    mockAlerts = mockAlerts.filter((a) => String(a.product_id) !== pid);
    return;
  }
  if (_id.startsWith('tendance_')) {
    const pid = _id.replace('tendance_', '');
    mockTendances = mockTendances.filter((t) => String(t.product_id) !== pid);
  }
}
