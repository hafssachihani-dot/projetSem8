import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { RiskLevel } from '@/models/risk';

const LABELS: Record<RiskLevel, string> = {
  [RiskLevel.OK]: 'OK',
  [RiskLevel.WARNING]: 'Vigilance',
  [RiskLevel.CRITICAL]: 'Critique',
};

const BG: Record<RiskLevel, string> = {
  [RiskLevel.OK]: Colors.primary + '33',
  [RiskLevel.WARNING]: Colors.accent + '44',
  [RiskLevel.CRITICAL]: Colors.destructive + '44',
};

const FG: Record<RiskLevel, string> = {
  [RiskLevel.OK]: Colors.primary,
  [RiskLevel.WARNING]: Colors.accent,
  [RiskLevel.CRITICAL]: Colors.destructive,
};

type Props = {
  level: RiskLevel;
};

export function RiskBadge({ level }: Props) {
  return (
    <View style={[styles.wrap, { backgroundColor: BG[level] }]}>
      <Text style={[styles.text, { color: FG[level] }]}>{LABELS[level]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
