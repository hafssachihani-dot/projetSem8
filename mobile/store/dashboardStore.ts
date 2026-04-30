import Toast from 'react-native-toast-message';
import { create } from 'zustand';
import {
  addProductApi,
  applyRandomStockSimulation,
  createPurchaseApi,
  fetchDashboard,
  removeMockNotificationById,
  setPurchaseStatusApi,
  stockMovementApi,
  type AddProductInput,
  type CreatePurchaseInput,
  type StockMovementInput,
} from '@/services/apiService';
import {
  loadNotifications,
  mergeNotifications,
  removeNotificationById,
  saveNotifications,
  type NotificationsBundle,
} from '@/services/notificationService';
import type { SmartNotification } from '@/models/notification';

let autoRefreshTimer: ReturnType<typeof setInterval> | null = null;

export interface DashboardState {
  products: import('@/models/product').Product[];
  purchases: import('@/models/purchase').Purchase[];
  notifications: NotificationsBundle;
  loading: boolean;
  lastUpdated: Date | null;
  loadDashboard: (silent?: boolean) => Promise<void>;
  addProduct: (data: AddProductInput) => Promise<void>;
  createPurchase: (data: CreatePurchaseInput) => Promise<void>;
  createStockMovement: (data: StockMovementInput) => Promise<void>;
  setPurchaseStatus: (
    id: string,
    status: import('@/models/purchase').PurchaseStatus,
  ) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  commanderFromNotif: (notification: SmartNotification) => Promise<void>;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  products: [],
  purchases: [],
  notifications: { alerts: [], tendances: [] },
  loading: false,
  lastUpdated: null,

  loadDashboard: async (silent = false) => {
    if (!silent) {
      set({ loading: true });
    }
    const stored = await loadNotifications();
    const data = await fetchDashboard();
    const merged = mergeNotifications(
      stored,
      data.notificationsJson,
      data.tendanceJson,
    );
    await saveNotifications(merged);
    set({
      products: data.products,
      purchases: data.purchases,
      notifications: merged,
      lastUpdated: new Date(),
    });
    if (!silent) {
      set({ loading: false });
    }
  },

  addProduct: async (data: AddProductInput) => {
    await addProductApi(data);
    Toast.show({ type: 'success', text1: 'Produit ajouté' });
    await get().loadDashboard(true);
  },

  createPurchase: async (data: CreatePurchaseInput) => {
    await createPurchaseApi(data);
    Toast.show({ type: 'success', text1: 'Achat créé' });
    await get().loadDashboard(true);
  },

  createStockMovement: async (data: StockMovementInput) => {
    await stockMovementApi(data);
    Toast.show({ type: 'success', text1: 'Mouvement enregistré' });
    await get().loadDashboard(true);
  },

  setPurchaseStatus: async (id, status) => {
    await setPurchaseStatusApi(id, status);
    await get().loadDashboard(true);
  },

  removeNotification: async (id: string) => {
    removeMockNotificationById(id);
    const next = removeNotificationById(get().notifications, id);
    set({ notifications: next });
    await saveNotifications(next);
  },

  commanderFromNotif: async (notification: SmartNotification) => {
    const products = get().products;
    const product = products.find(
      (p) =>
        p.id === notification.product_id ||
        String(p.id) === String(notification.product_id),
    );
    const qty = notification.recommended_order_quantity ?? 30;
    await createPurchaseApi({
      product_id: notification.product_id,
      product_name:
        notification.product_name || product?.product_name || 'Produit',
      quantity_ordered: qty,
      supplier_name: product?.supplier_name ?? '',
      supplier_email: product?.supplier_email ?? '',
      status: 'pending',
      message: '',
    });
    Toast.show({ type: 'success', text1: 'Commande créée ✅' });
    await get().removeNotification(notification._id);
    await get().loadDashboard(true);
  },

  startAutoRefresh: () => {
    get().stopAutoRefresh();
    autoRefreshTimer = setInterval(() => {
      applyRandomStockSimulation();
      void get().loadDashboard(true);
    }, 15_000);
  },

  stopAutoRefresh: () => {
    if (autoRefreshTimer) {
      clearInterval(autoRefreshTimer);
      autoRefreshTimer = null;
    }
  },
}));
