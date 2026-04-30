import { useCallback, useRef } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AddPurchaseSheet } from '@/components/AddPurchaseSheet';
import { EmptyState } from '@/components/EmptyState';
import { PurchaseCard } from '@/components/PurchaseCard';
import { Colors } from '@/constants/colors';
import type { Purchase } from '@/models/purchase';
import { useDashboardStore } from '@/store/dashboardStore';

export default function AchatsScreen() {
  const insets = useSafeAreaInsets();
  const purchases = useDashboardStore((s) => s.purchases);
  const setPurchaseStatus = useDashboardStore((s) => s.setPurchaseStatus);

  const addPurchaseRef = useRef<BottomSheetModal>(null);
  const swipeRefs = useRef<Map<string, Swipeable | null>>(new Map());

  const pendingCount = purchases.filter(
    (p) => p.status === 'pending' || p.status === 'sent',
  ).length;
  const totalQty = purchases
    .filter((p) => p.status === 'pending' || p.status === 'sent')
    .reduce((acc, p) => acc + p.quantity_ordered, 0);

  const openSheet = useCallback(() => {
    addPurchaseRef.current?.present();
  }, []);

  const renderLeftActions = useCallback(
    (
      progress: Animated.AnimatedInterpolation<string | number>,
      dragX: Animated.AnimatedInterpolation<string | number>,
      id: string,
    ) => {
      const scale = dragX.interpolate({
        inputRange: [0, 80],
        outputRange: [0.85, 1],
        extrapolate: 'clamp',
      });
      return (
        <View style={styles.leftActions}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
              style={styles.deliverBtn}
              onPress={() => {
                void setPurchaseStatus(id, 'delivered');
                swipeRefs.current.get(id)?.close();
              }}>
              <Text style={styles.actionText}>Livrer</Text>
            </Pressable>
          </Animated.View>
        </View>
      );
    },
    [setPurchaseStatus],
  );

  const renderRightActions = useCallback(
    (
      progress: Animated.AnimatedInterpolation<string | number>,
      dragX: Animated.AnimatedInterpolation<string | number>,
      id: string,
    ) => {
      const scale = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [1, 0.85],
        extrapolate: 'clamp',
      });
      return (
        <View style={styles.rightActions}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
              style={styles.cancelBtn}
              onPress={() => {
                void setPurchaseStatus(id, 'cancelled');
                swipeRefs.current.get(id)?.close();
              }}>
              <Text style={styles.actionText}>Annuler</Text>
            </Pressable>
          </Animated.View>
        </View>
      );
    },
    [setPurchaseStatus],
  );

  const renderItem = useCallback(
    ({ item }: { item: Purchase }) => {
      const canSwipe =
        item.status === 'pending' || item.status === 'sent';
      if (!canSwipe) {
        return <PurchaseCard purchase={item} />;
      }
      return (
        <Swipeable
          ref={(r) => {
            if (r) swipeRefs.current.set(item.id, r);
            else swipeRefs.current.delete(item.id);
          }}
          renderLeftActions={(progress, dragX) =>
            renderLeftActions(progress, dragX, item.id)
          }
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, item.id)
          }>
          <PurchaseCard purchase={item} />
        </Swipeable>
      );
    },
    [renderLeftActions, renderRightActions],
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.pageTitle}>Achats</Text>
      <Text style={styles.pageSub}>
        Suivi des commandes fournisseurs
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Achats en attente</Text>
          <Text style={[styles.statValue, { color: Colors.accent }]}>
            {pendingCount}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Quantité commandée</Text>
          <Text style={[styles.statValue, { color: Colors.blue }]}>
            {totalQty}
          </Text>
        </View>
      </View>

      {purchases.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="Aucun achat"
          subtitle="Créez un achat depuis le bouton +"
        />
      ) : (
        <FlatList
          data={purchases}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListFooterComponent={<View style={{ height: 88 }} />}
        />
      )}

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { bottom: 24 + insets.bottom },
          pressed && styles.pressed,
        ]}
        onPress={openSheet}>
        <MaterialCommunityIcons name="plus" size={28} color={Colors.card} />
      </Pressable>

      <AddPurchaseSheet ref={addPurchaseRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.slate,
    marginTop: 8,
  },
  pageSub: {
    fontSize: 14,
    color: Colors.slateLight,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.slateLight,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  list: {
    paddingBottom: 24,
  },
  leftActions: {
    justifyContent: 'center',
    marginRight: 10,
  },
  rightActions: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  deliverBtn: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    flex: 1,
    borderRadius: 12,
    marginVertical: 4,
  },
  cancelBtn: {
    backgroundColor: Colors.destructive,
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    flex: 1,
    borderRadius: 12,
    marginVertical: 4,
  },
  actionText: {
    color: Colors.card,
    fontWeight: '800',
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pressed: {
    opacity: 0.88,
  },
});
