import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

export type StatItem = {
  label: string;
  value: number | string;
  valueColor: string;
};

type Props = {
  items: StatItem[];
};

export function StatsRow({ items }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {items.map((it) => (
        <View key={it.label} style={styles.card}>
          <Text style={styles.label}>{it.label}</Text>
          <Text style={[styles.value, { color: it.valueColor }]}>{it.value}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 10,
    paddingVertical: 4,
    paddingRight: 8,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 112,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: Colors.slateLight,
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
  },
});
