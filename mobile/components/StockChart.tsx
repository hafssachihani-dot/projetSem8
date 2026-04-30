import { StyleSheet, Text, View } from 'react-native';
import { PolarChart, Pie } from 'victory-native';
import { Colors } from '@/constants/colors';

type SliceDatum = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  okCount: number;
  warningCount: number;
  criticalCount: number;
};

export function StockChart({ okCount, warningCount, criticalCount }: Props) {
  const fullTotal = okCount + warningCount + criticalCount;

  const pieData: SliceDatum[] = [
    { label: 'OK', value: okCount, color: '#22C55E' },
    { label: 'Vigilance', value: warningCount, color: '#F59E0B' },
    { label: 'Critique', value: criticalCount, color: '#EF4444' },
  ].filter((d) => d.value > 0);

  if (fullTotal === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Aucune donnée</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.chartBox}>
        <PolarChart
          data={pieData}
          labelKey="label"
          valueKey="value"
          colorKey="color">
          <Pie.Chart innerRadius="45%" />
        </PolarChart>
      </View>
      <View style={styles.legend}>
        {[
          { label: 'OK', value: okCount, color: '#22C55E' },
          { label: 'Vigilance', value: warningCount, color: '#F59E0B' },
          { label: 'Critique', value: criticalCount, color: '#EF4444' },
        ].map((d) => (
          <View key={d.label} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: d.color }]} />
            <Text style={styles.legendLabel}>{d.label}</Text>
            <Text style={styles.legendVal}>{d.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  chartBox: {
    height: 200,
    width: '100%',
  },
  emptyWrap: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.slateLight,
    fontSize: 14,
  },
  legend: {
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.slate,
  },
  legendVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.slate,
  },
});
