import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { format } from 'date-fns';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/colors';
import { useDashboardStore } from '@/store/dashboardStore';

type Props = {
  onDismiss?: () => void;
};

export const AddProductSheet = forwardRef<BottomSheetModal, Props>(
  function AddProductSheet({ onDismiss }, ref) {
    const addProduct = useDashboardStore((s) => s.addProduct);
    const snapPoints = useMemo(() => ['90%'], []);

    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [currentStock, setCurrentStock] = useState('50');
    const [minimumStock, setMinimumStock] = useState('20');
    const [supplierName, setSupplierName] = useState('');
    const [supplierEmail, setSupplierEmail] = useState('');
    const [temperature, setTemperature] = useState('25');
    const [humidity, setHumidity] = useState('55');
    const [expiry, setExpiry] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

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

    const reset = useCallback(() => {
      setProductName('');
      setCategory('');
      setCurrentStock('50');
      setMinimumStock('20');
      setSupplierName('');
      setSupplierEmail('');
      setTemperature('25');
      setHumidity('55');
      setExpiry(new Date());
    }, []);

    const handleSubmit = useCallback(async () => {
      const name = productName.trim();
      const cat = category.trim();
      if (!name || !cat) {
        return;
      }
      const cs = Number(currentStock);
      const ms = Number(minimumStock);
      const temp = Number(temperature);
      const hum = Number(humidity);
      await addProduct({
        product_name: name,
        category: cat,
        current_stock: Number.isFinite(cs) ? cs : 50,
        minimum_stock: Number.isFinite(ms) ? ms : 20,
        supplier_name: supplierName.trim(),
        supplier_email: supplierEmail.trim(),
        expiration_date: format(expiry, 'yyyy-MM-dd'),
        temperature: Number.isFinite(temp) ? temp : 25,
        humidity: Number.isFinite(hum) ? hum : 55,
      });
      reset();
      if (typeof ref !== 'function' && ref?.current) {
        ref.current.dismiss();
      }
      onDismiss?.();
    }, [
      addProduct,
      category,
      currentStock,
      expiry,
      humidity,
      minimumStock,
      productName,
      ref,
      reset,
      supplierEmail,
      supplierName,
      temperature,
      onDismiss,
    ]);

    const onChangeDate = useCallback(
      (_: unknown, date?: Date) => {
        if (Platform.OS !== 'ios') setShowPicker(false);
        if (date) setExpiry(date);
      },
      [],
    );

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
          <Text style={styles.title}>Nouveau produit</Text>

          <Text style={styles.label}>Nom du produit *</Text>
          <BottomSheetTextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor={Colors.slateLight}
            value={productName}
            onChangeText={setProductName}
          />

          <Text style={styles.label}>Catégorie *</Text>
          <BottomSheetTextInput
            style={styles.input}
            placeholder="Catégorie"
            placeholderTextColor={Colors.slateLight}
            value={category}
            onChangeText={setCategory}
          />

          <Text style={styles.label}>Stock actuel</Text>
          <BottomSheetTextInput
            style={styles.input}
            keyboardType="numeric"
            value={currentStock}
            onChangeText={setCurrentStock}
          />

          <Text style={styles.label}>Stock minimum</Text>
          <BottomSheetTextInput
            style={styles.input}
            keyboardType="numeric"
            value={minimumStock}
            onChangeText={setMinimumStock}
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

          <Text style={styles.label}>Température (°C)</Text>
          <BottomSheetTextInput
            style={styles.input}
            keyboardType="numeric"
            value={temperature}
            onChangeText={setTemperature}
          />

          <Text style={styles.label}>Humidité (%)</Text>
          <BottomSheetTextInput
            style={styles.input}
            keyboardType="numeric"
            value={humidity}
            onChangeText={setHumidity}
          />

          <Text style={styles.label}>Date d&apos;expiration</Text>
          <Pressable
            style={styles.inputLike}
            onPress={() => setShowPicker(true)}>
            <Text style={styles.inputLikeText}>
              {format(expiry, 'dd/MM/yyyy')}
            </Text>
          </Pressable>
          {showPicker && (
            <DateTimePicker
              value={expiry}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
            />
          )}

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
              onPress={() => void handleSubmit()}>
              <Text style={styles.btnOkText}>Ajouter ✅</Text>
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
  inputLike: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Colors.muted,
  },
  inputLikeText: {
    fontSize: 16,
    color: Colors.slate,
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
