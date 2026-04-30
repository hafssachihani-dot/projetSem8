import { Link, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

const LOGO = require('../assets/images/dynex-logo.png');

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = useCallback(() => {
    const e = email.trim();
    const p = password.trim();
    if (!e || !p) {
      return;
    }
    login();
    router.replace('/(tabs)');
  }, [email, login, password, router]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.top, { minHeight: Dimensions.get('window').height * 0.4 }]}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>DYNEX</Text>
          <Text style={styles.sub}>
            Prédire. Optimiser. Sécuriser.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Connexion</Text>

          <View style={styles.field}>
            <Text style={styles.icon}>✉️</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.icon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.pressed,
            ]}
            onPress={onSubmit}>
            <Text style={styles.primaryBtnText}>Se connecter</Text>
          </Pressable>

          <Link href="/signup" asChild>
            <Pressable style={styles.linkWrap}>
              <Text style={styles.link}>
                Pas de compte ? S&apos;inscrire
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  top: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
  },
  sub: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#22C55E',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 20,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
  },
  primaryBtn: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.88,
  },
  linkWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
    color: '#22C55E',
  },
});
