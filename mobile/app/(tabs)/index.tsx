import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AddProductSheet } from '@/components/AddProductSheet';
import { AddPurchaseSheet } from '@/components/AddPurchaseSheet';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { NotificationCard } from '@/components/NotificationCard';
import { ProductCard } from '@/components/ProductCard';
import { StatsRow } from '@/components/StatsRow';
import { StockChart } from '@/components/StockChart';
import { StockMovementSheet } from '@/components/StockMovementSheet';
import { Colors } from '@/constants/colors';
import type { Product } from '@/models/product';
import type { SmartNotification } from '@/models/notification';
import { getRisk, RiskLevel } from '@/models/risk';
import { useDashboardStore } from '@/store/dashboardStore';

export default function ProduitsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const products = useDashboardStore((s) => s.products);
  const purchases = useDashboardStore((s) => s.purchases);
  const notifications = useDashboardStore((s) => s.notifications);
  const loading = useDashboardStore((s) => s.loading);
  const loadDashboard = useDashboardStore((s) => s.loadDashboard);
  const removeNotification = useDashboardStore((s) => s.removeNotification);
  const commanderFromNotifStore = useDashboardStore(
    (s) => s.commanderFromNotif,
  );

  const commanderFromNotif = useCallback(
    async (n: SmartNotification) => {
      await commanderFromNotifStore(n);
      router.navigate('/(tabs)/purchases');
    },
    [commanderFromNotifStore, router],
  );

  const addProductRef = useRef<BottomSheetModal>(null);
  const addPurchaseRef = useRef<BottomSheetModal>(null);
  const movementRef = useRef<BottomSheetModal>(null);

  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [purchasePrefillId, setPurchasePrefillId] = useState<string | null>(
    null,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      p.product_name.toLowerCase().includes(q),
    );
  }, [products, query]);

  const statsItems = useMemo(() => {
    let ok = 0;
    let crit = 0;
    for (const p of products) {
      const r = getRisk(p);
      if (r === RiskLevel.OK) ok += 1;
      if (r === RiskLevel.CRITICAL) crit += 1;
    }
    const pendingPurchases = purchases.filter(
      (x) => x.status === 'pending' || x.status === 'sent',
    );
    const pendingCount = pendingPurchases.length;
    const qtyOrdered = pendingPurchases.reduce(
      (acc, x) => acc + x.quantity_ordered,
      0,
    );
    return [
      {
        label: 'TOTAL PRODUITS',
        value: products.length,
        valueColor: Colors.slate,
      },
      { label: 'STOCK OK', value: ok, valueColor: Colors.primary },
      {
        label: 'CRITIQUES',
        value: crit,
        valueColor: Colors.destructive,
      },
      {
        label: 'ACHATS PENDING',
        value: pendingCount,
        valueColor: Colors.accent,
      },
      {
        label: 'QTÉ COMMANDÉE',
        value: qtyOrdered,
        valueColor: Colors.blue,
      },
    ];
  }, [products, purchases]);

  const chartCounts = useMemo(() => {
    let ok = 0;
    let warning = 0;
    let critical = 0;
    for (const p of filtered) {
      const r = getRisk(p);
      if (r === RiskLevel.OK) ok += 1;
      else if (r === RiskLevel.WARNING) warning += 1;
      else critical += 1;
    }
    return { ok, warning, critical };
  }, [filtered]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadDashboard(true);
    } finally {
      setRefreshing(false);
    }
  }, [loadDashboard]);

  const openAddProduct = useCallback(() => {
    addProductRef.current?.present();
  }, []);

  const openAddPurchase = useCallback(() => {
    setPurchasePrefillId(null);
    addPurchaseRef.current?.present();
  }, []);

  const openMovement = useCallback(() => {
    movementRef.current?.present();
  }, []);

  const openPurchaseForProduct = useCallback((product: Product) => {
    setPurchasePrefillId(product.id);
    addPurchaseRef.current?.present();
  }, []);

  const header = useMemo(
    () => (
      <View style={styles.headerBlock}>
        <View style={styles.titleRow}>
          <View style={styles.titleCol}>
            <Text style={styles.screenTitle}>Dashboard</Text>
            <Text style={styles.screenSub}>
              Prévention des ruptures de stock avec IA
            </Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <MaterialCommunityIcons
            name="magnify"
            size={22}
            color={Colors.slateLight}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor={Colors.slateLight}
            value={query}
            onChangeText={setQuery}
          />
          <Pressable
            onPress={() => void loadDashboard(true)}
            style={({ pressed }) => [
              styles.refreshBtn,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Actualiser">
            <MaterialCommunityIcons
              name="refresh"
              size={22}
              color={Colors.slate}
            />
          </Pressable>
        </View>

        <StatsRow items={statsItems} />

        <View style={styles.notifSection}>
          <View style={styles.notifTitleRow}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={20}
              color={Colors.slate}
            />
            <Text style={styles.notifTitle}>Notifications IA</Text>
          </View>
          {notifications.alerts.length === 0 &&
          notifications.tendances.length === 0 ? (
            <Text style={styles.emptyNotif}>
              ✅ Aucune notification en attente
            </Text>
          ) : (
            <>
              {notifications.alerts.map((n) => (
                <NotificationCard
                  key={n._id}
                  notification={n}
                  variant="alert"
                  onDismiss={() => void removeNotification(n._id)}
                  onCommander={() => void commanderFromNotif(n)}
                />
              ))}
              {notifications.tendances.map((n) => (
                <NotificationCard
                  key={n._id}
                  notification={n}
                  variant="tendance"
                  onDismiss={() => void removeNotification(n._id)}
                />
              ))}
            </>
          )}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Répartition des stocks</Text>
          <StockChart
            okCount={chartCounts.ok}
            warningCount={chartCounts.warning}
            criticalCount={chartCounts.critical}
          />
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Produits & Stock intelligent</Text>
          <Text style={styles.sectionCount}>
            {filtered.length} produit(s) affiché(s)
          </Text>
        </View>
      </View>
    ),
    [
      chartCounts.critical,
      chartCounts.ok,
      chartCounts.warning,
      commanderFromNotif,
      filtered.length,
      loadDashboard,
      notifications.alerts,
      notifications.tendances,
      query,
      removeNotification,
      statsItems,
    ],
  );

  return (
    <View style={styles.screen}>
      {loading && products.length === 0 ? (
        <View style={styles.loadingWrap}>
          <LoadingSkeleton />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onCommander={openPurchaseForProduct}
            />
          )}
          ListHeaderComponent={header}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void onRefresh()}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyList}>Aucun produit à afficher.</Text>
          }
        />
      )}

      <View
        style={[
          styles.fabCol,
          { bottom: 24 + insets.bottom, right: 16 },
        ]}>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
          onPress={openAddProduct}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
          onPress={openAddPurchase}>
          <Text style={styles.fabText}>🛒</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
          onPress={openMovement}>
          <Text style={styles.fabText}>➖</Text>
        </Pressable>
      </View>

      <AddProductSheet ref={addProductRef} />
      <AddPurchaseSheet
        key={purchasePrefillId ?? 'none'}
        ref={addPurchaseRef}
        initialProductId={purchasePrefillId}
      />
      <StockMovementSheet ref={movementRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  headerBlock: {
    paddingBottom: 8,
  },
  titleRow: {
    marginBottom: 12,
  },
  titleCol: {
    gap: 4,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.slate,
  },
  screenSub: {
    fontSize: 14,
    color: Colors.slateLight,
    fontWeight: '500',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.slate,
  },
  refreshBtn: {
    padding: 8,
  },
  notifSection: {
    marginTop: 8,
    marginBottom: 12,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  notifTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.slate,
  },
  emptyNotif: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.slate,
    marginBottom: 8,
  },
  sectionHead: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.slate,
  },
  sectionCount: {
    fontSize: 13,
    color: Colors.slateLight,
    marginTop: 4,
  },
  emptyList: {
    textAlign: 'center',
    color: Colors.slateLight,
    paddingVertical: 24,
  },
  fabCol: {
    position: 'absolute',
    gap: 10,
    alignItems: 'flex-end',
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  fabText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.card,
  },
  pressed: {
    opacity: 0.85,
  },
});
