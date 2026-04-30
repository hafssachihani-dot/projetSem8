import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import type { Product } from '@/models/product';
import { getDaysBeforeRupture, getRisk } from '@/models/risk';
import { RiskBadge } from '@/components/RiskBadge';

type Props = {
  product: Product;
  onCommander: (product: Product) => void;
};

export function ProductCard({ product, onCommander }: Props) {
  const risk = getRisk(product);
  const coverage = getDaysBeforeRupture(product);
  const iaText =
    product.ai_recommendation.trim() !== ''
      ? product.ai_recommendation
      : 'Aucune recommandation IA disponible pour ce produit.';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={2}>
          {product.product_name}
        </Text>
        <RiskBadge level={risk} />
      </View>
      <Text style={styles.subId}>ID : {product.id || '—'}</Text>
      <View style={styles.chip}>
        <Text style={styles.chipText}>{product.category || '—'}</Text>
      </View>
      <Text style={styles.rowText}>
        Stock : {product.current_stock} / Min : {product.minimum_stock}
      </Text>
      <Text style={styles.rowText}>
        Couverture : {coverage} jour(s)
      </Text>
      <Text style={styles.supplier}>
        {product.supplier_name}
        {'\n'}
        {product.supplier_email}
      </Text>
      <Text style={styles.iot}>
        IoT — {product.temperature}°C / {product.humidity}%
      </Text>
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.btnIa,
            pressed && styles.btnPressed,
          ]}
          onPress={() =>
            Alert.alert('IA', iaText, [{ text: 'OK' }])
          }>
          <Text style={styles.btnIaText}>IA</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.btnBuy,
            pressed && styles.btnPressed,
          ]}
          onPress={() => onCommander(product)}>
          <Text style={styles.btnBuyText}>Commander</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: Colors.slate,
  },
  subId: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.slateLight,
  },
  chip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.blue,
  },
  rowText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.slate,
  },
  supplier: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.slateLight,
    lineHeight: 18,
  },
  iot: {
    marginTop: 6,
    fontSize: 13,
    color: Colors.slate,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  btnIa: {
    backgroundColor: Colors.purple + '22',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnIaText: {
    color: Colors.purple,
    fontWeight: '800',
    fontSize: 14,
  },
  btnBuy: {
    backgroundColor: Colors.accent + '33',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnBuyText: {
    color: Colors.accent,
    fontWeight: '800',
    fontSize: 14,
  },
  btnPressed: {
    opacity: 0.78,
  },
});
