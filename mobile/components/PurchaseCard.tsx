import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import type { Purchase } from '@/models/purchase';

type Props = {
  purchase: Purchase;
};

function formatDate(iso: string): string {
  try {
    const d = parseISO(iso);
    if (!isValid(d)) return iso;
    return format(d, 'PPp', { locale: fr });
  } catch {
    return iso;
  }
}

function statusStyle(status: Purchase['status']) {
  switch (status) {
    case 'delivered':
      return { bg: Colors.primary + '33', fg: Colors.primary };
    case 'cancelled':
      return { bg: Colors.destructive + '33', fg: Colors.destructive };
    default:
      return { bg: Colors.accent + '33', fg: Colors.accent };
  }
}

function statusLabel(status: Purchase['status']) {
  switch (status) {
    case 'delivered':
      return 'Livré';
    case 'cancelled':
      return 'Annulé';
    case 'sent':
      return 'Envoyé';
    default:
      return 'En attente';
  }
}

export function PurchaseCard({ purchase }: Props) {
  const st = statusStyle(purchase.status);
  return (
    <View style={styles.card}>
      <Text style={styles.idLine}>#{purchase.id}</Text>
      <Text style={styles.title}>{purchase.product_name}</Text>
      <Text style={styles.supplier}>
        {purchase.supplier_name}
        {'\n'}
        {purchase.supplier_email}
      </Text>
      <Text style={styles.qty}>Quantité : {purchase.quantity_ordered}</Text>
      <View style={[styles.chip, { backgroundColor: st.bg }]}>
        <Text style={[styles.chipText, { color: st.fg }]}>
          {statusLabel(purchase.status)}
        </Text>
      </View>
      <Text style={styles.date}>{formatDate(purchase.created_at)}</Text>
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
  idLine: {
    fontSize: 12,
    color: Colors.slateLight,
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.slate,
    marginBottom: 8,
  },
  supplier: {
    fontSize: 12,
    color: Colors.slateLight,
    lineHeight: 18,
    marginBottom: 8,
  },
  qty: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.slate,
    marginBottom: 10,
  },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  date: {
    fontSize: 12,
    color: Colors.slateLight,
  },
});
