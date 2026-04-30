import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import type { SmartNotification } from '@/models/notification';

type Props = {
  notification: SmartNotification;
  variant: 'alert' | 'tendance';
  onDismiss: () => void;
  onCommander?: () => void;
};

export function NotificationCard({
  notification,
  variant,
  onDismiss,
  onCommander,
}: Props) {
  const isAlert = variant === 'alert';
  return (
    <View
      style={[
        styles.card,
        isAlert ? styles.cardAlert : styles.cardTrend,
      ]}>
      <Text style={styles.title}>{notification.product_name}</Text>
      <Text style={styles.reason}>{notification.reason}</Text>
      {isAlert &&
        notification.recommended_order_quantity != null && (
          <Text style={styles.reco}>
            Qté recommandée : {notification.recommended_order_quantity}
          </Text>
        )}
      <View style={styles.row}>
        {isAlert ? (
          <>
            <Pressable
              style={({ pressed }) => [
                styles.btnGhost,
                pressed && styles.pressed,
              ]}
              onPress={onDismiss}>
              <Text style={styles.btnGhostText}>Annuler</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.btnPrimary,
                pressed && styles.pressed,
              ]}
              onPress={onCommander}>
              <Text style={styles.btnPrimaryText}>Commander</Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.btnTrend,
              pressed && styles.pressed,
            ]}
            onPress={onDismiss}>
            <Text style={styles.btnTrendText}>OK</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardAlert: {
    backgroundColor: Colors.destructive + '18',
    borderColor: Colors.destructive + '55',
  },
  cardTrend: {
    backgroundColor: Colors.accent + '22',
    borderColor: Colors.accent + '66',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.slate,
    marginBottom: 6,
  },
  reason: {
    fontSize: 14,
    color: Colors.slate,
    marginBottom: 8,
  },
  reco: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.slate,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    flexWrap: 'wrap',
  },
  btnGhost: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  btnGhostText: {
    fontWeight: '700',
    color: Colors.slate,
    fontSize: 14,
  },
  btnPrimary: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.accent,
  },
  btnPrimaryText: {
    fontWeight: '800',
    color: Colors.card,
    fontSize: 14,
  },
  btnTrend: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    alignSelf: 'flex-end',
  },
  btnTrendText: {
    fontWeight: '800',
    color: Colors.card,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.82,
  },
});
