import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Text, Avatar, Button, Divider, useTheme, Portal, Dialog } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { ROLES_LABEL } from '../../constants/roles';

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const [activeModal, setActiveModal] = useState(null); // 'security' | 'support' | 'about'

  const initials = (user?.name || 'U')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleMenuPress = (key) => {
    if (key === 'notifications') {
      navigation.navigate('Notifikasi');
    } else {
      setActiveModal(key);
    }
  };

  const handleOpenWhatsApp = () => {
    Linking.openURL('https://wa.me/6281234567890?text=Halo%20CS%20HuniHub,%20saya%20butuh%20bantuan');
  };

  const handleOpenEmail = () => {
    Linking.openURL('mailto:support@hunihub.id?subject=Bantuan%20Pengguna%20HuniHub');
  };

  const menuItems = [
    { key: 'notifications', icon: 'bell-outline', title: 'Notifikasi & Pemberitahuan' },
    { key: 'security', icon: 'shield-check-outline', title: 'Keamanan & Privasi' },
    { key: 'support', icon: 'help-circle-outline', title: 'Pusat Bantuan & CS' },
    { key: 'about', icon: 'information-outline', title: 'Tentang HuniHub v1.0' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Avatar.Text
          size={76}
          label={initials}
          style={{ backgroundColor: '#0D9488' }}
          labelStyle={{ color: '#FFFFFF', fontWeight: '800', fontSize: 28 }}
        />
        <Text style={styles.name}>{user?.name || 'Pengguna'}</Text>
        <Text style={styles.email}>{user?.email || 'pengguna@hunihub.id'}</Text>

        <View style={styles.roleChip}>
          <MaterialCommunityIcons name="shield-account" size={14} color="#0D9488" />
          <Text style={styles.roleText}>{ROLES_LABEL[user?.role] || 'Pengguna'}</Text>
        </View>
      </View>

      {/* Account Settings Menu */}
      <View style={styles.menuContainer}>
        <Text style={styles.menuHeader}>Pengaturan Akun & Layanan</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.key}>
              <Pressable
                style={styles.menuRow}
                onPress={() => handleMenuPress(item.key)}
              >
                <View style={styles.menuLeft}>
                  <MaterialCommunityIcons name={item.icon} size={20} color="#0D9488" />
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
              </Pressable>
              {index < menuItems.length - 1 && <Divider style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Logout Button */}
      <Button
        mode="outlined"
        textColor="#EF4444"
        icon="logout"
        onPress={signOut}
        style={styles.logoutBtn}
      >
        Keluar dari Akun
      </Button>

      {/* Modal Dialog: Keamanan & Privasi */}
      <Portal>
        <Dialog
          visible={activeModal === 'security'}
          onDismiss={() => setActiveModal(null)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>Keamanan & Privasi</Dialog.Title>
          <Dialog.Content>
            <View style={styles.dialogIconBox}>
              <MaterialCommunityIcons name="shield-check" size={32} color="#0D9488" />
            </View>
            <Text style={styles.dialogText}>
              Akun Anda terlindungi dengan enkripsi lokal aman berbasis AsyncStorage dan otentikasi terstandarisasi.
            </Text>
            <Text style={[styles.dialogText, { marginTop: 8 }]}>
              Data pribadi, riwayat persewaan, dan kontak Anda tidak akan pernah dibagikan kepada pihak ketiga tanpa izin.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setActiveModal(null)} textColor="#0D9488">
              Saya Mengerti
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Modal Dialog: Pusat Bantuan & CS */}
      <Portal>
        <Dialog
          visible={activeModal === 'support'}
          onDismiss={() => setActiveModal(null)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>Pusat Bantuan & CS</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Butuh bantuan dengan hunian, pemesanan, atau kendala aplikasi? Tim Customer Service HuniHub siap membantu Anda.
            </Text>
            <View style={styles.csContactRow}>
              <Button
                mode="contained"
                icon="whatsapp"
                buttonColor="#25D366"
                textColor="#FFFFFF"
                style={{ flex: 1, borderRadius: 10 }}
                onPress={handleOpenWhatsApp}
              >
                WhatsApp CS
              </Button>
              <Button
                mode="contained-tonal"
                icon="email-outline"
                buttonColor="#F0FDFA"
                textColor="#0F766E"
                style={{ flex: 1, borderRadius: 10 }}
                onPress={handleOpenEmail}
              >
                Email CS
              </Button>
            </View>
            <Text style={styles.operationalText}>
              ⏰ Jam Operasional: Setiap hari 08.00 - 22.00 WIB
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setActiveModal(null)} textColor="#64748B">
              Tutup
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Modal Dialog: Tentang HuniHub */}
      <Portal>
        <Dialog
          visible={activeModal === 'about'}
          onDismiss={() => setActiveModal(null)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>Tentang HuniHub</Dialog.Title>
          <Dialog.Content>
            <View style={styles.dialogIconBox}>
              <MaterialCommunityIcons name="home-heart" size={36} color="#0D9488" />
            </View>
            <Text style={[styles.dialogTitleText, { textAlign: 'center', marginBottom: 4 }]}>
              HuniHub v1.0.0
            </Text>
            <Text style={[styles.dialogText, { textAlign: 'center' }]}>
              Platform penyewaan terpusat untuk Homestay, Kost, dan Rumah Sewa di daerah Aceh Barat (Meulaboh & Sekitarnya). Mempertemukan mahasiswa, pekerja, dan keluarga dengan pemilik hunian secara praktis dan terpercaya.
            </Text>
            <Divider style={{ marginVertical: 12 }} />
            <Text style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>
              Dibuat dengan React Native (Expo) • Safe & Fast Local-First Storage
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setActiveModal(null)} textColor="#0D9488">
              Tutup
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 18,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  email: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  divider: {
    backgroundColor: '#F1F5F9',
  },
  logoutBtn: {
    borderRadius: 14,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
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
  dialogTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  dialogIconBox: {
    alignItems: 'center',
    marginBottom: 10,
  },
  dialogText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  csContactRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    marginBottom: 12,
  },
  operationalText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
});
