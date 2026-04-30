import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '@/constants/colors';
import type { PurchaseStatus } from '@/models/purchase';
import { useDashboardStore } from '@/store/dashboardStore';

export type AddPurchaseSheetProps = {
  initialProductId?: string | null;
  onDismiss?: () => void;
};

const STATUSES: PurchaseStatus[] = [
  'pending',
  'sent',
  'delivered',
  'cancelled',
];

export const AddPurchaseSheet = forwardRef<
  BottomSheetModal,
  AddPurchaseSheetProps
>(function AddPurchaseSheet({ initialProductId, onDismiss }, ref) {
  const products = useDashboardStore((s) => s.products);
  const createPurchase = useDashboardStore((s) => s.createPurchase);
  const snapPoints = useMemo(() => ['85%'], []);

  const [productId, setProductId] = useState('');
  const [quantityOrdered, setQuantityOrdered] = useState('30');
  const [supplierName, setSupplierName] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [status, setStatus] = useState<PurchaseStatus>('pending');
  const [message, setMessage] = useState('');

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

  const applyProduct = useCallback(
    (pid: string) => {
      const p = products.find((x) => x.id === pid);
      if (p) {
        setSupplierName(p.supplier_name);
        setSupplierEmail(p.supplier_email);
      }
    },
    [products],
  );

  useEffect(() => {
    if (!products.length) return;
    if (initialProductId) {
      const exists = products.some((p) => p.id === initialProductId);
      if (exists) {
        setProductId(initialProductId);
        applyProduct(initialProductId);
      }
    }
  }, [initialProductId, products, applyProduct]);

  useEffect(() => {
    if (productId) applyProduct(productId);
  }, [productId, applyProduct]);

  const reset = useCallback(() => {
    setProductId('');
    setQuantityOrdered('30');
    setSupplierName('');
    setSupplierEmail('');
    setStatus('pending');
    setMessage('');
  }, []);

  const handleSubmit = useCallback(async () => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const q = Number(quantityOrdered);
    await createPurchase({
      product_id: p.id,
      product_name: p.product_name,
      quantity_ordered: Number.isFinite(q) ? q : 30,
      supplier_name: supplierName.trim(),
      supplier_email: supplierEmail.trim(),
      status,
      message: message.trim(),
    });
    reset();
    if (typeof ref !== 'function' && ref?.current) {
      ref.current.dismiss();
    }
    onDismiss?.();
  }, [
    createPurchase,
    message,
    productId,
    products,
    quantityOrdered,
    ref,
    reset,
    status,
    supplierEmail,
    supplierName,
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
        <Text style={styles.title}>Créer un achat</Text>

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

        <Text style={styles.label}>Quantité commandée</Text>
        <BottomSheetTextInput
          style={styles.input}
          keyboardType="numeric"
          value={quantityOrdered}
          onChangeText={setQuantityOrdered}
        />

        <Text style={styles.label}>Fournisseur</Text>
        <BottomSheetTextInput
          style={styles.input}
          value={supplierName}
          onChangeText={setSupplierName}
        />

        <Text style={styles.label}>Email fournisseur</Text>
        <BottomSheetTextInput
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={supplierEmail}
          onChangeText={setSupplierEmail}
        />

        <Text style={styles.label}>Statut</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={status}
            onValueChange={(v) => setStatus(v as PurchaseStatus)}>
            {STATUSES.map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Message</Text>
        <BottomSheetTextInput
          style={[styles.input, styles.multi]}
          multiline
          value={message}
          onChangeText={setMessage}
        />

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
            <Text style={styles.btnOkText}>Créer achat 🛒</Text>
          </Pressable>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

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
    paddingBottom: 32,
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
    minHeight: 88,
    textAlignVertical: 'top',
  },
  pickerWrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.muted,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
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
    backgroundColor: Colors.accent,
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
