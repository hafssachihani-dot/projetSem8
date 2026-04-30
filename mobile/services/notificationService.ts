import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  notificationFromUnknown,
  type SmartNotification,
} from '@/models/notification';

export const STORAGE_KEY = 'smart_stock_notifications_v1';

export interface NotificationsBundle {
  alerts: SmartNotification[];
  tendances: SmartNotification[];
}

function upsertById(
  list: SmartNotification[],
  item: SmartNotification,
): SmartNotification[] {
  const idx = list.findIndex((x) => x._id === item._id);
  if (idx >= 0) {
    const next = [...list];
    next[idx] = { ...next[idx], ...item };
    return next;
  }
  return [...list, item];
}

export function mergeNotifications(
  existing: NotificationsBundle,
  newAlerts: unknown[],
  newTendances: unknown[],
): NotificationsBundle {
  let alerts = [...existing.alerts];
  for (const raw of newAlerts) {
    const n = notificationFromUnknown(raw, 'alert');
    if (!n) continue;
    n._id = `alert_${n.product_id}`;
    n.kind = 'alert';
    alerts = upsertById(alerts, n);
  }

  let tendances = [...existing.tendances];
  for (const raw of newTendances) {
    const n = notificationFromUnknown(raw, 'tendance');
    if (!n) continue;
    n._id = `tendance_${n.product_id}`;
    n.kind = 'tendance';
    tendances = upsertById(tendances, n);
  }

  return { alerts, tendances };
}

export async function loadNotifications(): Promise<NotificationsBundle> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { alerts: [], tendances: [] };
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return { alerts: [], tendances: [] };
    }
    const o = parsed as Record<string, unknown>;
    const alerts = normalizeNotificationList(o.alerts, 'alert');
    const tendances = normalizeNotificationList(o.tendances, 'tendance');
    return { alerts, tendances };
  } catch {
    return { alerts: [], tendances: [] };
  }
}

function normalizeNotificationList(
  value: unknown,
  kind: SmartNotification['kind'],
): SmartNotification[] {
  const arr = Array.isArray(value) ? value : [];
  const out: SmartNotification[] = [];
  for (const item of arr) {
    if (item && typeof item === 'object') {
      const n = notificationFromUnknown(item, kind);
      if (n) out.push(n);
    }
  }
  return out;
}

export async function saveNotifications(
  data: NotificationsBundle,
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function removeNotificationById(
  bundle: NotificationsBundle,
  id: string,
): NotificationsBundle {
  return {
    alerts: bundle.alerts.filter((a) => a._id !== id),
    tendances: bundle.tendances.filter((t) => t._id !== id),
  };
}
