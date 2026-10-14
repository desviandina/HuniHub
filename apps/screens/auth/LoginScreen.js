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

export default function LoginScreen({ navigation }) {
  const theme = useTheme();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('alya@hunihub.test');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(ROLES.SEEKER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectRole = (newRole) => {
    setRole(newRole);
    if (newRole === ROLES.SEEKER && (email === 'rudi@hunihub.test' || !email)) {
      setEmail('alya@hunihub.test');
      setPassword('password123');
    } else if (newRole === ROLES.OWNER && (email === 'alya@hunihub.test' || !email)) {
      setEmail('rudi@hunihub.test');
      setPassword('password123');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn({ email, password, role });
    } catch (err) {
      setError('Gagal masuk. Periksa kembali email dan password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle(role);
    } catch (err) {
      setError('Gagal masuk dengan Google.');
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
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="home-heart" size={38} color="#FFFFFF" />
          </View>
          <Text style={styles.brandTitle}>HuniHub</Text>
          <Text style={styles.brandSubtitle}>
            Sewa Homestay, Kost, dan Rumah Lebih Nyaman
          </Text>
        </View>

        {/* Visual Role Selector */}
        <Text style={styles.roleTitle}>Masuk Sebagai:</Text>
        <View style={styles.roleRow}>
          <Pressable
            onPress={() => handleSelectRole(ROLES.SEEKER)}
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
            <Text style={styles.roleCardDesc}>Cari & sewa hunian</Text>
          </Pressable>

          <Pressable
            onPress={() => handleSelectRole(ROLES.OWNER)}
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
            <Text style={styles.roleCardDesc}>Kelola & pasarkan</Text>
          </Pressable>
        </View>

        {/* Form Inputs */}
        <View style={styles.formContainer}>
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
            placeholder="Masukkan kata sandi"
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

          {error ? (
            <HelperText type="error" visible style={styles.helperText}>
              {error}
            </HelperText>
          ) : null}

          {/* Action Buttons */}
          <Button
            mode="contained"
            buttonColor="#0D9488"
            textColor="#FFFFFF"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
            labelStyle={styles.loginButtonLabel}
          >
            Masuk Sekarang
          </Button>

          <Button
            mode="outlined"
            icon="google"
            textColor="#0F172A"
            onPress={handleGoogle}
            loading={loading}
            style={styles.googleButton}
          >
            Masuk dengan Google
          </Button>

          <Button
            mode="text"
            textColor="#0D9488"
            onPress={() => navigation.navigate('Register')}
            style={styles.registerLink}
          >
            Belum punya akun? <Text style={{ fontWeight: '700', color: '#0D9488' }}>Daftar sekarang</Text>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#0D9488',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
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
    marginBottom: 18,
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
  loginButton: {
    borderRadius: 14,
    marginTop: 4,
    paddingVertical: 2,
  },
  loginButtonLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  googleButton: {
    borderRadius: 14,
    borderColor: '#E2E8F0',
  },
  registerLink: {
    marginTop: 6,
  },
});