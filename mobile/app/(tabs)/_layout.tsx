import { Redirect, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DynexHeaderLeft,
  DynexHeaderRight,
} from '@/components/DynexTabHeader';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStore } from '@/store/dashboardStore';

export default function TabLayout() {
  const { isLoggedIn } = useAuth();
  const insets = useSafeAreaInsets();
  const bottomPad =
    Platform.OS === 'ios'
      ? Math.max(insets.bottom, 8)
      : Math.max(insets.bottom, 6);

  const loadDashboard = useDashboardStore((s) => s.loadDashboard);
  const startAutoRefresh = useDashboardStore((s) => s.startAutoRefresh);
  const stopAutoRefresh = useDashboardStore((s) => s.stopAutoRefresh);

  useEffect(() => {
    void loadDashboard(false);
    startAutoRefresh();
    return () => {
      stopAutoRefresh();
    };
  }, [loadDashboard, startAutoRefresh, stopAutoRefresh]);

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerStyle: {
          backgroundColor: Colors.card,
          elevation: 2,
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 4,
        },
        headerTintColor: Colors.slate,
        headerLeft: () => <DynexHeaderLeft />,
        headerRight: () => <DynexHeaderRight />,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.slateLight,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          paddingTop: 6,
          paddingBottom: bottomPad,
          height: 58 + bottomPad,
        },
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Produits',
          tabBarIcon: () => <Text style={styles.emojiIcon}>📦</Text>,
        }}
      />
      <Tabs.Screen
        name="purchases"
        options={{
          title: 'Achats',
          tabBarIcon: () => <Text style={styles.emojiIcon}>🛒</Text>,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  emojiIcon: {
    fontSize: 22,
  },
});
