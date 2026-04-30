import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '@/constants/colors';
import { useDashboardStore } from '@/store/dashboardStore';

type MovementType = 'IN' | 'OUT';

type Props = {
  onDismiss?: () => void;
};

export const StockMovementSheet = forwardRef<BottomSheetModal, Props>(
  function StockMovementSheet({ onDismiss }, ref) {
    const products = useDashboardStore((s) => s.products);
    const createStockMovement = useDashboardStore((s) => s.createStockMovement);
    const snapPoints = useMemo(() => ['75%'], []);

    const [movementType, setMovementType] = useState<MovementType>('OUT');
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [reason, setReason] = useState('');

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          {...props}
        />
      ),
      [],
    );

    const selected = products.find((p) => p.id === productId);
    const currentStock = selected?.current_stock ?? 0;
    const qtyNum = Number(quantity);
    const validQty = Number.isFinite(qtyNum) ? Math.max(0, qtyNum) : 0;
    const delta =
      movementType === 'IN' ? validQty : -validQty;
    const after = currentStock + delta;

    const reset = useCallback(() => {
      setMovementType('OUT');
      setProductId('');
      setQuantity('1');
      setReason('');
    }, []);

    const handleSubmit = useCallback(async () => {
      const p = products.find((x) => x.id === productId);
      if (!p) {
        Toast.show({ type: 'error', text1: 'Sélectionnez un produit' });
        return;
      }
      if (validQty < 1) {
        Toast.show({ type: 'error', text1: 'Quantité minimale : 1' });
        return;
      }
      if (movementType === 'OUT' && validQty > currentStock) {
        Toast.show({
          type: 'error',
          text1: 'Stock insuffisant pour cette sortie',
        });
        return;
      }
      await createStockMovement({
        product_name: p.product_name,
        quantity: validQty,
        reason: reason.trim(),
        type: movementType,
      });
      reset();
      if (typeof ref !== 'function' && ref?.current) {
        ref.current.dismiss();
      }
      onDismiss?.();
    }, [
      createStockMovement,
      currentStock,
      movementType,
      productId,
      products,
      reason,
      ref,
      reset,
      validQty,
      onDismiss,
    ]);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
        onDismiss={() => {
          reset();
          onDismiss?.();
        }}>
        <BottomSheetScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Mouvement de stock</Text>

          <Text style={styles.label}>Type</Text>
          <View style={styles.segment}>
            <Pressable
              style={[
                styles.segBtn,
                movementType === 'OUT' && styles.segBtnActive,
              ]}
              onPress={() => setMovementType('OUT')}>
              <Text
                style={[
                  styles.segText,
                  movementType === 'OUT' && styles.segTextActive,
                ]}>
                OUT
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.segBtn,
                movementType === 'IN' && styles.segBtnActive,
              ]}
              onPress={() => setMovementType('IN')}>
              <Text
                style={[
                  styles.segText,
                  movementType === 'IN' && styles.segTextActive,
                ]}>
                IN
              </Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Produit</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={productId}
              onValueChange={(v) => setProductId(String(v))}>
              <Picker.Item label="— Sélectionner —" value="" />
              {products.map((p) => (
                <Picker.Item
                  key={p.id}
                  label={p.product_name}
                  value={p.id}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Quantité</Text>
          <BottomSheetTextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text style={styles.label}>Motif</Text>
          <BottomSheetTextInput
            style={[styles.input, styles.multi]}
            multiline
            value={reason}
            onChangeText={setReason}
          />

          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Aperçu</Text>
            <Text style={styles.previewLine}>
              Stock actuel :{' '}
              <Text style={styles.previewStrong}>{currentStock}</Text>
              {' → après mouvement : '}
              <Text
                style={[
                  styles.previewStrong,
                  { color: after < 0 ? Colors.destructive : Colors.primary },
                ]}>
                {after}
              </Text>
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.btnGhost,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                if (typeof ref !== 'function' && ref?.current) {
                  ref.current.dismiss();
                }
              }}>
              <Text style={styles.btnGhostText}>Annuler</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.btnOk,
                pressed && styles.pressed,
              ]}
              onPress={() => void handleSubmit()}
              disabled={!productId}>
              <Text style={styles.btnOkText}>Enregistrer</Text>
            </Pressable>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handle: {
    backgroundColor: Colors.border,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.slate,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.slateLight,
    marginBottom: 6,
    marginTop: 10,
  },
  segment: {
    flexDirection: 'row',
    gap: 10,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.muted,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  segBtnActive: {
    backgroundColor: Colors.primary + '33',
    borderColor: Colors.primary,
  },
  segText: {
    fontWeight: '800',
    color: Colors.slateLight,
    fontSize: 15,
  },
  segTextActive: {
    color: Colors.primary,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: Colors.slate,
    backgroundColor: Colors.muted,
  },
  multi: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  pickerWrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.muted,
  },
  preview: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.muted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.slateLight,
    marginBottom: 6,
  },
  previewLine: {
    fontSize: 15,
    color: Colors.slate,
    lineHeight: 22,
  },
  previewStrong: {
    fontWeight: '800',
    color: Colors.slate,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  btnGhost: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.muted,
  },
  btnGhostText: {
    fontWeight: '700',
    color: Colors.slate,
    fontSize: 15,
  },
  btnOk: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  btnOkText: {
    fontWeight: '800',
    color: Colors.card,
    fontSize: 15,
  },
  pressed: {
    opacity: 0.85,
  },
});
