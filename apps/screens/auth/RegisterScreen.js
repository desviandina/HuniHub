import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  useTheme,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import { isValidEmail } from '../../services/authService';

export default function RegisterScreen({ navigation }) {
  const theme = useTheme();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [initialMode, setInitialMode] = useState(ROLES.SEEKER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError('Nama lengkap wajib diisi.');
      return;
    }

    if (!trimmedEmail) {
      setError('Alamat email wajib diisi.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Format email tidak valid. Masukkan alamat email yang benar (contoh: user@domain.com).');
      return;
    }

    if (!password) {
      setError('Kata sandi wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal harus terdiri dari 6 karakter.');
      return;
    }

    if (!confirmPassword) {
      setError('Harap konfirmasi password Anda.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register({
        email: trimmedEmail,
        password,
        name: trimmedName,
        initialMode,
      });
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>Buat Akun HuniHub</Text>
          <Text style={styles.subtitle}>
            Satu akun untuk semua kebutuhan — jelajahi hunian atau pasarkan properti Anda.
          </Text>
        </View>

        {/* Multi-role info banner */}
        <View style={styles.multiRoleBanner}>
          <MaterialCommunityIcons name="shield-account" size={20} color="#0D9488" />
          <Text style={styles.multiRoleBannerText}>
            Akun Multi-Role: Anda dapat beralih antara Mode Pencari dan Mode Pemilik kapan saja tanpa perlu mendaftar ulang.
          </Text>
        </View>

        {/* Initial Mode Preference */}
        <Text style={styles.roleTitle}>Mulai Dengan Mode:</Text>
        <View style={styles.roleRow}>
          <Pressable
            onPress={() => setInitialMode(ROLES.SEEKER)}
            style={[styles.roleCard, initialMode === ROLES.SEEKER && styles.roleCardActive]}
          >
            <MaterialCommunityIcons
              name="account-search-outline"
              size={22}
              color={initialMode === ROLES.SEEKER ? '#0D9488' : '#64748B'}
            />
            <Text
              style={[
                styles.roleCardTitle,
                initialMode === ROLES.SEEKER && styles.roleCardTitleActive,
              ]}
            >
              Pencari Hunian
            </Text>
            <Text style={styles.roleCardDesc}>Sewa kost / homestay</Text>
          </Pressable>

          <Pressable
            onPress={() => setInitialMode(ROLES.OWNER)}
            style={[styles.roleCard, initialMode === ROLES.OWNER && styles.roleCardActive]}
          >
            <MaterialCommunityIcons
              name="home-city-outline"
              size={22}
              color={initialMode === ROLES.OWNER ? '#0D9488' : '#64748B'}
            />
            <Text
              style={[
                styles.roleCardTitle,
                initialMode === ROLES.OWNER && styles.roleCardTitleActive,
              ]}
            >
              Pemilik Hunian
            </Text>
            <Text style={styles.roleCardDesc}>Pasarkan hunian</Text>
          </Pressable>
        </View>

        {/* Form Inputs */}
        <View style={styles.formContainer}>
          <TextInput
            label="Nama Lengkap"
            placeholder="cth: Muhammad Fikri"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError('');
            }}
            mode="outlined"
            outlineColor="#E2E8F0"
            activeOutlineColor="#0D9488"
            style={styles.input}
            left={<TextInput.Icon icon="account-outline" color="#0D9488" />}
          />

          <TextInput
            label="Email"
            placeholder="nama@email.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            outlineColor="#E2E8F0"
            activeOutlineColor="#0D9488"
            style={styles.input}
            left={<TextInput.Icon icon="email-outline" color="#0D9488" />}
          />

          <TextInput
            label="Password"
            placeholder="Minimal 6 karakter"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError('');
            }}
            secureTextEntry={!showPassword}
            mode="outlined"
            outlineColor="#E2E8F0"
            activeOutlineColor="#0D9488"
            style={styles.input}
            left={<TextInput.Icon icon="lock-outline" color="#0D9488" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
                color="#64748B"
              />
            }
          />

          <TextInput
            label="Konfirmasi Password"
            placeholder="Ulangi kata sandi"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (error) setError('');
            }}
            secureTextEntry={!showPassword}
            mode="outlined"
            outlineColor="#E2E8F0"
            activeOutlineColor="#0D9488"
            style={styles.input}
            left={<TextInput.Icon icon="lock-check-outline" color="#0D9488" />}
          />

          {error ? (
            <HelperText type="error" visible style={styles.helperText}>
              {error}
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            buttonColor="#0D9488"
            textColor="#FFFFFF"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.registerBtn}
            contentStyle={{ height: 48 }}
            labelStyle={styles.btnLabel}
          >
            Daftar Akun HuniHub
          </Button>

          <Button
            mode="text"
            textColor="#0D9488"
            onPress={() => navigation.goBack()}
            style={styles.loginLink}
          >
            Sudah punya akun? <Text style={{ fontWeight: '700', color: '#0D9488' }}>Masuk di sini</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  logoImage: {
    width: 68,
    height: 68,
    borderRadius: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  multiRoleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    gap: 10,
  },
  multiRoleBannerText: {
    flex: 1,
    fontSize: 11,
    color: '#0F766E',
    lineHeight: 16,
    fontWeight: '500',
  },
  roleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  roleCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  roleCardActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0D9488',
  },
  roleCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginTop: 6,
  },
  roleCardTitleActive: {
    color: '#0D9488',
  },
  roleCardDesc: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  formContainer: {
    gap: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  helperText: {
    marginTop: -4,
    fontSize: 12,
  },
  registerBtn: {
    borderRadius: 14,
    marginTop: 6,
  },
  btnLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  loginLink: {
    marginTop: 4,
  },
});
