import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

export default function RegisterScreen({ navigation }) {
  const theme = useTheme();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(ROLES.SEEKER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Semua kolom wajib diisi.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ email, password, name, role });
    } catch (err) {
      setError('Gagal mendaftar. Coba lagi.');
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
          <Text style={styles.title}>Buat Akun HuniHub</Text>
          <Text style={styles.subtitle}>
            Bergabung untuk mencari atau mempromosikan hunian terbaik.
          </Text>
        </View>

        {/* Role Selector */}
        <Text style={styles.roleTitle}>Daftar Sebagai:</Text>
        <View style={styles.roleRow}>
          <Pressable
            onPress={() => setRole(ROLES.SEEKER)}
            style={[styles.roleCard, role === ROLES.SEEKER && styles.roleCardActive]}
          >
            <MaterialCommunityIcons
              name="account-search-outline"
              size={22}
              color={role === ROLES.SEEKER ? '#0D9488' : '#64748B'}
            />
            <Text
              style={[
                styles.roleCardTitle,
                role === ROLES.SEEKER && styles.roleCardTitleActive,
              ]}
            >
              Pencari Hunian
            </Text>
            <Text style={styles.roleCardDesc}>Sewa homestay / kost</Text>
          </Pressable>

          <Pressable
            onPress={() => setRole(ROLES.OWNER)}
            style={[styles.roleCard, role === ROLES.OWNER && styles.roleCardActive]}
          >
            <MaterialCommunityIcons
              name="home-city-outline"
              size={22}
              color={role === ROLES.OWNER ? '#0D9488' : '#64748B'}
            />
            <Text
              style={[
                styles.roleCardTitle,
                role === ROLES.OWNER && styles.roleCardTitleActive,
              ]}
            >
              Pemilik Hunian
            </Text>
            <Text style={styles.roleCardDesc}>Pasarkan hunian</Text>
          </Pressable>
        </View>

        {/* Inputs */}
        <View style={styles.formContainer}>
          <TextInput
            label="Nama Lengkap"
            placeholder="Alya Putri"
            value={name}
            onChangeText={setName}
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
            onChangeText={setEmail}
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
            onChangeText={setPassword}
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
            onChangeText={setConfirmPassword}
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
            style={styles.registerBtn}
            labelStyle={styles.btnLabel}
          >
            Daftar Sekarang
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
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  roleTitle: {
    fontSize: 13,
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
  },
  registerBtn: {
    borderRadius: 14,
    marginTop: 6,
    paddingVertical: 2,
  },
  btnLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  loginLink: {
    marginTop: 4,
  },
});