import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/colors';

type Props = {
  count?: number;
};

export function LoadingSkeleton({ count = 4 }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 900,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  const opacity = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.35, 0.85, 0.35],
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          style={[styles.card, { opacity }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingVertical: 8,
  },
  card: {
    height: 96,
    borderRadius: 16,
    backgroundColor: Colors.muted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
});
