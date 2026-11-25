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
  Portal,
  Dialog,
  Snackbar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import { forgotPassword, isValidEmail } from '../../services/authService';

export default function LoginScreen({ navigation }) {
  const theme = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password state
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Format email tidak valid (contoh: user@domain.com).');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signIn({ email: trimmedEmail, password });
    } catch (err) {
      setError(err.message || 'Gagal masuk. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      setSnackbar('Masukkan alamat email Anda terlebih dahulu.');
      return;
    }
    if (!isValidEmail(forgotEmail.trim())) {
      setSnackbar('Format email tidak valid.');
      return;
    }
    setForgotLoading(true);
    try {
      await forgotPassword(forgotEmail.trim());
      setShowForgotDialog(false);
      setForgotEmail('');
      setSnackbar('Email reset password telah dikirim. Periksa kotak masuk Anda.');
    } catch (err) {
      setSnackbar(err.message || 'Gagal mengirim email reset. Periksa apakah email terdaftar.');
    } finally {
      setForgotLoading(false);
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
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.brandTitle}>HuniHub</Text>
          <Text style={styles.brandSubtitle}>
            Platform Sewa Hunian • Kost, Homestay, & Sewa Rumah
          </Text>
        </View>

        {/* Multi-role notice badge */}
        <View style={styles.multiRoleNotice}>
          <MaterialCommunityIcons name="account-sync-outline" size={18} color="#0D9488" />
          <Text style={styles.multiRoleNoticeText}>
            Satu akun untuk dua mode: Akses Pencari dan Pemilik Hunian secara seamless.
          </Text>
        </View>

        {/* Inputs */}
        <View style={styles.formContainer}>
          <TextInput
            label="Email Terdaftar"
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
            placeholder="Masukkan kata sandi"
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

          {error ? (
            <HelperText type="error" visible style={styles.helperText}>
              {error}
            </HelperText>
          ) : null}

          {/* Forgot Password Link */}
          <Pressable
            onPress={() => {
              setForgotEmail(email);
              setShowForgotDialog(true);
            }}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
          </Pressable>

          {/* Login Button */}
          <Button
            mode="contained"
            buttonColor="#0D9488"
            textColor="#FFFFFF"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginBtn}
            contentStyle={{ height: 48 }}
            labelStyle={styles.btnLabel}
          >
            Masuk ke HuniHub
          </Button>

          {/* Register Link */}
          <Button
            mode="text"
            textColor="#0D9488"
            onPress={() => navigation.navigate('Register')}
            style={styles.registerLink}
          >
            Belum punya akun?{' '}
            <Text style={{ fontWeight: '800', color: '#0D9488' }}>
              Daftar Sekarang
            </Text>
          </Button>
        </View>

        {/* Dialog: Lupa Password */}
        <Portal>
          <Dialog
            visible={showForgotDialog}
            onDismiss={() => setShowForgotDialog(false)}
            style={styles.dialog}
          >
            <Dialog.Title style={styles.dialogTitle}>Reset Password</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogDesc}>
                Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
              </Text>
              <TextInput
                label="Alamat Email"
                placeholder="nama@email.com"
                value={forgotEmail}
                onChangeText={setForgotEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                mode="outlined"
                outlineColor="#E2E8F0"
                activeOutlineColor="#0D9488"
                style={{ backgroundColor: '#FFFFFF', marginTop: 12 }}
                left={<TextInput.Icon icon="email-outline" color="#0D9488" />}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => setShowForgotDialog(false)}
                textColor="#64748B"
                disabled={forgotLoading}
              >
                Batal
              </Button>
              <Button
                mode="contained"
                buttonColor="#0D9488"
                textColor="#FFFFFF"
                loading={forgotLoading}
                disabled={forgotLoading}
                onPress={handleForgotPassword}
                style={{ borderRadius: 10 }}
              >
                Kirim Tautan
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Snackbar
          visible={Boolean(snackbar)}
          onDismiss={() => setSnackbar('')}
          duration={3500}
          style={{ backgroundColor: '#0F172A' }}
        >
          {snackbar}
        </Snackbar>
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
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 76,
    height: 76,
    borderRadius: 20,
    marginBottom: 10,
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
    marginTop: 4,
    textAlign: 'center',
  },
  multiRoleNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    gap: 10,
  },
  multiRoleNoticeText: {
    flex: 1,
    fontSize: 11,
    color: '#0F766E',
    lineHeight: 16,
    fontWeight: '500',
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -4,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#0D9488',
    fontWeight: '700',
  },
  loginBtn: {
    borderRadius: 14,
    marginTop: 4,
  },
  btnLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  registerLink: {
    marginTop: 16,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  dialogDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
});
