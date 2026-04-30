import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { format } from 'date-fns';
import { Colors } from '@/constants/colors';
import { useDashboardStore } from '@/store/dashboardStore';

const LOGO = require('../assets/images/dynex-logo.png');

export function DynexHeaderLeft() {
  return (
    <View style={styles.leftWrap}>
      <Image source={LOGO} style={styles.logoSmall} resizeMode="contain" />
      <Text style={styles.brand}>DYNEX</Text>
    </View>
  );
}

export function DynexHeaderRight() {
  const lastUpdated = useDashboardStore((s) => s.lastUpdated);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  const timeStr =
    lastUpdated != null ? format(lastUpdated, 'HH:mm:ss') : '--:--:--';

  return (
    <View style={styles.rightCol}>
      <View style={styles.statusRow}>
        <Animated.View style={[styles.dot, { opacity: pulse }]} />
        <Text style={styles.connected}>Connecté</Text>
      </View>
      <Text style={styles.updated}>
        Dernière mise à jour : {timeStr}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  leftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 4,
  },
  logoSmall: {
    width: 32,
    height: 32,
  },
  brand: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.sidebar,
  },
  rightCol: {
    alignItems: 'flex-end',
    marginRight: 8,
    maxWidth: 200,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  connected: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.slate,
  },
  updated: {
    fontSize: 10,
    color: Colors.slateLight,
    marginTop: 2,
    fontWeight: '500',
  },
});
