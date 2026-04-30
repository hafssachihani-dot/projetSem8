import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

const LOGO = require('../assets/images/dynex-logo.png');

export default function SplashScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const fadeLogo = useRef(new Animated.Value(0)).current;
  const scaleLogo = useRef(new Animated.Value(0.92)).current;
  const fadeTag = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeLogo, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleLogo, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(fadeTag, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });

    const mkLoop = (v: Animated.Value, delayMs: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delayMs),
          Animated.timing(v, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );

    const l1 = mkLoop(dot1, 0);
    const l2 = mkLoop(dot2, 150);
    const l3 = mkLoop(dot3, 300);
    l1.start();
    l2.start();
    l3.start();

    return () => {
      l1.stop();
      l2.stop();
      l3.stop();
    };
  }, [dot1, dot2, dot3, fadeLogo, fadeTag, scaleLogo]);

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(isLoggedIn ? '/(tabs)' : '/login');
    }, 2000);
    return () => clearTimeout(t);
  }, [isLoggedIn, router]);

  return (
    <View style={styles.screen}>
      <Animated.View
        style={[
          styles.logoBlock,
          {
            opacity: fadeLogo,
            transform: [{ scale: scaleLogo }],
          },
        ]}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
      </Animated.View>
      <Animated.Text style={[styles.tagline, { opacity: fadeTag }]}>
        Prédire. Optimiser. Sécuriser.
      </Animated.Text>
      <View style={styles.dots}>
        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
  },
  logoBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 160,
  },
  tagline: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
    letterSpacing: 0.5,
  },
  dots: {
    position: 'absolute',
    bottom: 56,
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E293B',
  },
});
